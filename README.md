## 1. Cài đặt

### Cần cài đặt:

- Node.js
- npm
- Java
- Maven
- MySQL
- Google Chrome

### Cài đặt Backend

#### Cấu hình database trong: `/src/main/resources/application.yaml`

```java
    url: jdbc:mysql://localhost:3306/tracker-article
    username: your_username
    password: your_password
```

### Cài đặt Frontend

```bash
cd tracker-frontend
npm install
npm run dev
```

### Cài đặt Extension

Truy cập: [chrome://extensions/]()
Bật: `Developer mode`
Chọn: `Load unpacked`
Đến đường dẫn này `your_path/tracker_news` Sau đó chọn thư mục: `tracker-extension`

## Kiến trúc hệ thống

![Kiến trúc hệ thống](/docs/structure.png)

## Giải pháp

### Câu 1: Cách xác định thời gian người dùng thực sự đọc bài báo, thay vì chỉ tính thời gian tab được mở.

> Theo đề bài đã cho, chúng ta đã xây dựng 4 loại event chính: PAGE_ENTER, PAGE_ACTIVE, PAGE_INACTIVE và PAGE_LEAVE.
>
> rong đó, PAGE_ACTIVE và PAGE_INACTIVE được sử dụng để xác định khoảng thời gian người dùng thực sự đọc bài báo, thay vì chỉ tính toàn bộ thời gian tab được mở.
>
> Khi người dùng truy cập vào một bài báo, hệ thống sẽ tạo event PAGE_ENTER và đồng thời xác định người dùng đang ở trạng thái ACTIVE, từ đó ghi nhận event PAGE_ACTIVE.
>
> Trong quá trình đọc, nếu người dùng có các thao tác như scroll, click hoặc touch, hệ thống tiếp tục duy trì trạng thái ACTIVE. Nếu người dùng chuyển sang tab khác, chuyển sang ứng dụng khác hoặc không có tương tác trong 60 giây, hệ thống chuyển sang trạng thái INACTIVE và ghi nhận event PAGE_INACTIVE.
>
> Khi người dùng quay lại bài báo, hệ thống chuyển trạng thái trở lại ACTIVE và ghi nhận một event PAGE_ACTIVE mới. Quá trình này tiếp tục cho đến khi người dùng rời khỏi bài báo, lúc đó event PAGE_LEAVE được ghi nhận.
>
> Cuối cùng, thời gian đọc thực tế được xác định bằng cách tính tổng các khoảng thời gian giữa PAGE_ACTIVE và PAGE_INACTIVE . Cách tiếp cận này giúp loại bỏ những khoảng thời gian người dùng mở bài báo nhưng không thực sự đọc.

### Câu 2:

#### a.Xác định các tạo và quản lý session_id

> Khi người dùng truy cập vào một bài báo, Chrome Extension sẽ gửi thông tin bài báo lên Backend. Backend chịu trách nhiệm tạo một session_id duy nhất cho phiên đọc và lưu thông tin session vào database.
>
> **Backend tạo session_id**
>
> ```java
>  String sessionId = UUID.randomUUID().toString();
> ```
>
> Sau khi tạo session thành công, Backend trả về session_id cho Extension. Extension sẽ lưu session_id vào chrome.storage.local để có thể sử dụng lại trong suốt phiên đọc. Việc lưu trữ này giúp Extension duy trì thông tin session ngay cả khi service worker được khởi động lại.
>
> **Extension nhận session_id và lưu vào chrome.storage.local**
>
> ```js
> await chrome.storage.session.set({
>   [`tab_${tabId}`]: {
>     sessionId: data.sessionId,
>     url: message.data.article.url,
>   },
> });
> ```
>
> Khi có event phát sinh, Extension lấy session_id của session hiện tại và gửi kèm theo event lên Backend. Các event bao gồm PAGE_ENTER, PAGE_ACTIVE, PAGE_INACTIVE và PAGE_LEAVE.

#### b. Giải thích tại sao nên lưu dữ liệu dạng event thay vì chỉ lưu một bản ghi tổng hợp sau khi người dùng kết thúc đọc bài báo.

> Lý do chính là dữ liệu event lưu lại lịch sử hoạt động theo thời gian, từ đó có thể tái hiện và phân tích quá trình người dùng đọc bài báo.
> Ví dụ, với một phiên đọc:
>
> 10:00:00 PAGE_ENTER
> 10:00:01 PAGE_ACTIVE
> 10:02:30 PAGE_INACTIVE
> 10:05:00 PAGE_ACTIVE
> 10:07:00 PAGE_INACTIVE
> 10:08:00 PAGE_ACTIVE
> 10:10:00 PAGE_LEAVE
>
> Từ các event này, hệ thống có thể tính được tổng thời gian đọc thực tế bằng cách cộng các khoảng thời gian ACTIVE. Đồng thời, có thể biết được người dùng đã bao nhiêu lần rời khỏi trạng thái active và quay lại đọc bài.
>
> Nếu chỉ lưu một bản ghi tổng hợp thì chỉ biết kết quả cuối cùng mà không biết quá trình nào đã tạo ra kết quả đó.

### Câu 3: Xử lý tình huống thực tế

#### 1.Người dùng mở đồng thời nhiều tab.

> Hệ thống cho phép người dùng mở và đọc nhiều bài báo trên nhiều tab khác nhau cùng lúc. Mỗi tab được quản lý độc lập và có một session_id tương ứng với phiên đọc của bài báo đang mở trên tab đó.
>
> ```js
> const tabId = sender.tab.id;
> await chrome.storage.session.set({
>   [`tab_${tabId}`]: {
>     sessionId: data.sessionId,
>     url: message.data.article.url,
>   },
> });
> ```
>
> Khi người dùng mở một bài báo trên một tab mới, Chrome Extension kiểm tra session tương ứng với tab và URL hiện tại. Nếu chưa có session, Extension gửi request đến Backend để tạo một session_id mới. session_id sau đó được lưu lại để sử dụng cho các event phát sinh trên tab đó.
>
> Khi người dùng chuyển từ tab này sang tab khác, trạng thái `ACTIVE`/`INACTIVE` của từng tab được cập nhật dựa trên `visibilitychange`, `focus` và `blur`. Vì mỗi tab có session riêng nên các event của các bài báo không bị trộn lẫn với nhau.

#### 2. Người dùng chuyển liên tục giữa các tab

> Khi người dùng liên tục chuyển đổi giữa nhiều tab, hệ thống dựa vào trạng thái _visibilitychange_, _focus_ và _blur_ để xác định tab nào đang được người dùng đọc.
>
> Khi người dùng rời khỏi một tab, tab đó chuyển sang trạng thái `INACTIVE` và ghi nhận event `PAGE_INACTIVE`. Khi người dùng quay lại tab đó, hệ thống chuyển sang trạng thái `ACTIVE` và ghi nhận event `PAGE_ACTIVE`.

#### 3. Người dùng mở tab nhưng không thao tác trong thời gian dài.

> Trường hợp người dùng mở bài báo nhưng không thực sự đọc hoặc không có bất kỳ thao tác nào trong một khoảng thời gian dài, hệ thống sử dụng cơ chế `inactivity timeout` để xác định trạng thái `INACTIVE`.
>
> Cụ thể, hệ thống thiết lập thời gian không hoạt động là `60 giây`. Mỗi khi người dùng có thao tác như scroll, click hoặc touchstart, bộ đếm thời gian sẽ được `reset`. Nếu trong 60 giây không phát sinh bất kỳ thao tác nào, hệ thống chuyển người dùng từ trạng thái `ACTIVE` sang `INACTIVE` và ghi nhận event `PAGE_INACTIVE`.

#### 4. Extension gửi cùng một event nhiều lần

> Trong quá trình theo dõi, các event `PAGE_ACTIVE` và `PAGE_INACTIVE` có thể được kích hoạt từ nhiều nguồn khác nhau như `scroll`, `click`, `visibilitychange`, `focus` và `blur`. Nếu không kiểm soát, Extension có thể gửi cùng một loại event nhiều lần liên tiếp.
>
> Để xử lý vấn đề này, hệ thống sử dụng biến trạng thái `isUserActive` để xác định trạng thái hiện tại của người dùng.
>
> Khi gọi `setUserActive()`, event `PAGE_ACTIVE` chỉ được gửi nếu trạng thái trước đó là `INACTIVE`. Nếu người dùng vẫn đang ở trạng thái `ACTIVE`, các lần gọi tiếp theo chỉ reset bộ đếm thời gian inactivity mà không gửi thêm event.
>
> Tương tự, `setUserInactive()` chỉ gửi `PAGE_INACTIVE` khi trạng thái hiện tại là `ACTIVE`. Nếu người dùng đã ở trạng thái `INACTIVE`, hàm sẽ kết thúc ngay và không gửi event mới.
>
> ```js
> let isUserActive = false;
>
> function setUserInactive() {
>   if (!isUserActive) return;
>
>   isUserActive = false;
>   sendEvent(eventTypes.PAGE_INACTIVE);
> }
>
> function setUserActive() {
>   if (!isUserActive) {
>     isUserActive = true;
>     sendEvent(eventTypes.PAGE_ACTIVE);
>   }
>
>   clearTimeout(inactiveTimer);
>   inactiveTimer = setTimeout(setUserInactive, INACTIVE_TIME);
> }
> ```

#### 5: Mất kết nối Internet trong thời gian Extension đang hoạt động.

> Trong trường hợp người dùng mất kết nối Internet trong khi Extension vẫn đang hoạt động, các event phát sinh gửi không thành công, Extension sử dụng một Event Queue để lưu tạm các event chưa gửi thành công.
>
> Khi một event phát sinh, Extension đưa event vào queue được lưu trong chrome.storage.local, sau đó thực hiện gửi event đến Backend. Nếu kết nối Internet bình thường và Backend nhận thành công, event sẽ được xóa khỏi queue.
>
> Nếu mất kết nối Internet khiến request thất bại, event vẫn được giữ lại trong chrome.storage.local. Khi kết nối được khôi phục, Extension tiếp tục xử lý queue và gửi lại các event chưa được gửi thành công lên Backend.

> **Hàm nhận event được gửi từ extension**
>
> ```js
> chrome.runtime.onMessage.addListener((message, sender, sendResponse) => >{
>  if (message.type !== "TRACK_EVENT") {
>    return;
>  }
>
>  const event = message.data;
>
>  queueResolve = queueResolve
>    .then(async () => {
>      const queue = await getEventQueue();
>      queue.push(event);
>      await setEventQueue(queue);
>    })
>    .then(() => processQueue())
>    .catch((error) => console.log(error.message));
> });
> ```

> **Hàm xử lý queue**
>
> ```js
> async function processQueue() {
>   if (isProcessing) {
>     return;
>   }
>
>   isProcessing = true;
>   let queue = await getEventQueue();
>
>   while (queue.length > 0) {
>     const event = queue[0];
>
>     try {
>       await sendEvent(event);
>       queue.shift();
>       await setEventQueue(queue);
>     } catch (error) {
>       console.error(error);
>       break;
>     }
>   }
>   isProcessing = false;
> }
> ```

> **Hàm gửi event đến backend**
>
> ```js
> async function sendEvent(event) {
>   const response = await fetch("http://localhost:8080/api/events", {
>     method: "POST",
>     headers: {
>       "Content-Type": "application/json",
>     },
>     body: JSON.stringify(event),
>   });
>
>   if (!response.ok) {
>     throw new Error(`HTTP ${response.status}`);
>   }
> }
> ```

#### Ta giả lập việc mất kết nối bằng cách stop backend thì khi các event gửi không thành công sẽ được lưu ở chrome.storage.local

![event queue](/docs/queue.png)

## Danh sách các chức năng đã hoàn thành

- Xây dưng extension thu thập các thông tin: URL bài báo, domain, tiêu đề, nội dung, thời gian bắt đầu, thời gian kêt thúc, tổng thời gian đọc báo, timeline
- Xây dựng queue để lưu tạm thời event khi mất internet
- Xây dựng backend với các API CRUD
- Xây dựng website hiển thị thông tin đã thu thập

## Các hạn chế của project

- Chưa có phần cấu hình thêm domain website mới
- Xác định thời gian đọc báo chưa hiệu quả
- Chưa xử lý được tình huống đóng chrome đột ngột nên không phát sinh `PAGE_LEAVE`
- Chưa xử lý được tình huống khi website thay đổi cấu trúc `HTML` làm chức năng nội dung bài báo không hoạt động chính xác
- Chưa xây dựng dashboard với các biểu đồ
-
