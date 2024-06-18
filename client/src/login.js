document.getElementById("login").addEventListener("click",async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User logged in successfully:', result);

            // 로그인 성공 시 index.html로 이동
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            console.error('로그인 실패 :', error.message);
            alert('로그인 실패 : ' + error.message);
        }
    } catch (error) {
        console.error('로그인 중 에러발생:', error);
        alert('로그인중 에러가 발생 했습니다.');
    }
});

  document.getElementById("back").addEventListener("click", () => {
    window.location.href = "index.html";
  });