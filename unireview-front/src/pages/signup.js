import React, { useState } from 'react';
import '../style/signup.css'
const SignUp = () => {
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState(null);
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async(e) => {
    e.preventDefault();
    if (senha !== confirmSenha) {
      setError('A senhas não correspondem');
    } else {
      setError('');
      try {
        const response = await fetch('http://localhost:3001/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome,email,senha,matricula,curso,foto }),
        });

        if (response.ok) {
          // Sign up successful
          alert('Sign up successful!');
        } else {
          // Handle error response
          const data = await response.json();
          setError(data.error);
        }
      } catch (error) {
        // Handle network or other errors
        setError(error.message || 'An error occurred. Please try again later.');
        console.log(error)
      }
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleSignUp}>

        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label>email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Curso:</label>
          <input
            type="text"
            value={curso}
            onChange={(e) => setCurso(e.target.value)}
          />
        </div>
        <div>
          <label>Matricula:</label>
          <input
            type="text"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>
        <div>

          <label>Foto:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])} // Atualiza o estado com a foto selecionada
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
        <div>
          <label>Confirmar senha:</label>
          <input
            type="senha"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
