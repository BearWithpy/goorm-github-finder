# 구름톤 트레이닝 과제 #3(10/27 ~ 10/31)

**자바스크립트를 이용해서 github finder 앱 만들기**

[하위 과제]

-   자바스크립트 OOP를 이용해서 구현합니다.
-   비동기 통신을 이용합니다.
-   위에 기능 외에 잔디밭 기능, Spinner 기능 등 원하는 기능을 추가해봅시다.

개발 기간: 2023.10.27

### 비고

-   다시 페이지로 돌아왔을 때 localStorage에 내용을 불러와서 이전 검색 내용을 유지한다
-   토큰값이 빠져있기 때문에 그대로 클론하여 실행하면 에러가 발생합니다!!

```javascript
// js/script.js
...

constructor() {
        this.API_URL = "https://api.github.com/users/"
        this.accessToken = "token token MYTOKEN!!!!"
        this.initElements()
        this.initEventListeners()
        this.loadFromLocalStorage()
        this.searchOnLoad()
}

...
```
