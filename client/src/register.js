document.getElementById("register").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User registered successfully:', result);

            // 회원가입 성공 시 index.html로 이동
            window.location.href = 'index.html';
        } else {
            const error = await response.json();
            console.error('Registration failed:', error.message);
            alert('Registration failed: ' + error.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration.');
    }
});