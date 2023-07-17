import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Review() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [prof_txt, setProfTxt] = useState(null);
  const [course_txt, setClassTxt] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/reviews/${id}`); // Replace with your API endpoint
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
      alert('Você precisa estar logado para fazer apagar uma review!');
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
        const response = await fetch(`http://localhost:3001/reviews/${id}`, {
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



    const handleChange = async (e) => {
        e.preventDefault();
    
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (!storedUser) {
          alert('Você precisa estar logado para mudar uma avaliação');
          return;
        }

        if(JSON.parse(sessionStorage.getItem('user')).id!=data[0].user_id){
          alert('Você não pode alterar o comentario de outro usuario');
          return
        }
       

        try {
          const response = await fetch(`http://localhost:3001/reviews/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  JSON.stringify({ prof_txt,course_txt }),
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
          <h3>id da avaliação: {data[0].review_id}</h3>
          <p>id do avaliador: {data[0].user_id}</p>
          <p>nota do professor: {data[0].prof_score}</p>
          <p>descrição do professor: {data[0].prof_txt}</p>
          <p>nota da disciplina: {data[0].course_score}</p>
          <p>descrição da disciplina: {data[0].course_txt}</p>
          <form onSubmit={handleChange}>
            <label htmlFor="prof_txt">Nova descrição de professor:</label>
            <input
              type="text"
              id="prof_txt"
              value={prof_txt}
              onChange={(e) => setProfTxt(e.target.value)}
            />

            <label htmlFor="course_txt">Nova descrição da disciplina:</label>

            <input
              type="text"
              id="course_txt"
              value={course_txt}
              onChange={(e) => setClassTxt(e.target.value)}
            />

            <button type="submit">Alterar comentário</button>
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

export default Review;
