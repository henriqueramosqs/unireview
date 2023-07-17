import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Report() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reason, setReason] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reports/${id}`); // Replace with your API endpoint
        if (response.ok) { 
          const data = await response.json();
          setData(data);
          console.log("data: ",data);
        } else {
          throw new Error('Error: ' + response.status);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [id]);


  const handleClick = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser) {
      alert('Você precisa estar logado para fazer apagar uma denuncia!');
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
        const response = await fetch(`http://localhost:3001/reports/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          alert('Denuncia apagado!');
        } else {
          const data = await response.json();
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };



    const handleReasonChange = async (e) => {
        e.preventDefault();
    
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (!storedUser) {
          alert('Você precisa estar logado para mudar email!');
          return;
        }

        if(JSON.parse(sessionStorage.getItem('user')).id!=data[0].user_id){
          alert('Você não pode alterar o comentario de outro usuario');
          return
        }
       

        try {
          const response = await fetch(`http://localhost:3001/reports/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  JSON.stringify({ reason }),
          });
  
          if (response.ok) {
            alert('Comentário mudado!');
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
          <h2>id: {data[0].id}</h2>
          <h3>id do avaliador: {data[0].user_id}</h3>
          <h3>id da avaliação: {data[0].review_id}</h3>
          <h3>id do avaliador da denúncia: {data[0].reviewer_id}</h3>
          <h3>Motivo: {data[0].reason}</h3>
          <h3>Aceito: {data[0].accepted}</h3>
          <form onSubmit={handleReasonChange}>
            <label htmlFor="novoComentario">Novo comentário:</label>
            <input
              type="text"
              id="novoComentario"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <button type="submit">Alterar comtário</button>
          </form>

          <button onClick={handleClick}> Apagar</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div>
    
      </div>
    </div>


  );
}

export default Report;
