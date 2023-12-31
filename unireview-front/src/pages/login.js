import React, { useState } from 'react';
import '../style/login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}&senha=${encodeURIComponent(senha)}`);

      if (response.ok) {
        const result = await response.json();

        if (result.length === 0) {
          alert('Nome ou senha inválida');
        } else {

          const { foto, ...rest } = result;
          sessionStorage.setItem('user', JSON.stringify(rest));

          //teste
          console.log(sessionStorage.getItem('user'))
          alert('Login bem sucedido!');
        }
      } else {
        // Handle error response
        alert('Erro ao fazer login');
      }
    } catch (error) {
      // Handle network or other errors
      alert(error)
    }
  };
  return (
    <div>
      <h2>Login</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleLogin}>
        <div>
          <label>email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
