import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function User() {
  const { id } = useParams();
  const [data, setData] = useState(null);

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

  // const apagar = async ()=>{
  //   e.preventDefault();
  //   // Perform any additional validation or data handling here
  //   const storedData = sessionStorage.getItem('user');
  //   if(!storedData){
  //     alert("Você precisa estar logado para fazer deletar alguém!")
  //     return;
  //   }

  //   if(JSON.parse(storedData).is)
    
  //   formData.user_id = JSON.parse(sessionStorage.getItem('user')).id
  //   console.log(formData)

  //   try {
  //     const response = await axios.delete(`http://localhost:3001/${id}`)

  //     if (response.ok) {
  //       // Sign up successful
  //       alert('Apagou com sucesso');
  //     } else {
  //       // Handle error response
  //       const data = await response.json();
  //       console.log(data.error);
  //     }
  //   } 
  //   catch (error) {
  //     // Handle network or other errors
  //     console.log(error)
  //   }


  // }

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


  return (
    <div>
      {data ? (
        <div>
          <h2>id: {data.id}</h2>
          <h3>Nome: {data.email}</h3>
          <h3>Curso: {data.matricula}</h3>
          <h3>Curso: {data.curso}</h3>
          {data.foto && <img src={getPhotoUrl()} alt="User Photo" />}
          {/* <button onClick={apagar}>Apagar</button> */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default User;
