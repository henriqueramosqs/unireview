import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function User() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [email,setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${id}`); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setData(data);
          console.log(data);
        } else {
          throw new Error('Error: ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [id]);


  const getPhotoUrl = () => {
    if (data && data.foto) {
      const base64String = btoa(
        new Uint8Array(data.foto.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      return `data:${data.foto.type};base64,${base64String}`;
    }
    return null;
  };


  const handleClick = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser) {
      alert('Você precisa estar logado para fazer apagar um usuário!');
      return;
    }


    try {
        console.log(sessionStorage.getItem('user'))
        console.log("olha aí "+ JSON.parse(sessionStorage.getItem('user')).id)
        const response = await fetch(`http://localhost:3001/admins/${JSON.parse(sessionStorage.getItem('user')).id}`,{
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            }
        });
        if (!response.ok) {
          throw new Error('Erro ao saber se é admin');
        }
    
        // Continue with the rest of the form submission logic...
    
      } catch (error) {
        console.error(error);
        alert('Você não é admin');
        return;
      }


      try {
        const response = await fetch(`http://localhost:3001/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Usuário apagado!');
        } else {
          const data = await response.json();
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };


     const handleEmailChange = async (e) => {
        e.preventDefault();
    
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (!storedUser) {
          alert('Você precisa estar logado para mudar email!');
          return;
        }

        console.log(sessionStorage.getItem('user'))
        console.log("olha aí "+ JSON.parse(sessionStorage.getItem('user')).id)

        if(JSON.parse(sessionStorage.getItem('user')).id!=id){
          alert('Você não pode alterar o email de outro usuario');
          return
        }
       

        try {
          const response = await fetch(`http://localhost:3001/users/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  JSON.stringify({ email }),
          });
  
          if (response.ok) {
            alert('Email mudado!');
          } else {
            const data = await response.json();
            console.log(data.error);
          }
        } catch (error) {
          console.log(error);
        }
    };






  return (
    <div>
      {data ? (
        <div>
          <h2>id: {data.id}</h2>
          <h3>Nome: {data.nome}</h3>
          <h3>Email: {data.email}</h3>
          <h3>Matricula: {data.matricula}</h3>
          <h3>Curso: {data.curso}</h3>
          {data.foto && <img src={getPhotoUrl()} alt="User Photo" />}
          <form onSubmit={handleEmailChange}>
            <label htmlFor="newEmail">Novo Email:</label>
            <input
              type="email"
              id="newEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Alterar Email</button>
          </form>

          <button onClick={handleClick}> Apagar</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default User;
