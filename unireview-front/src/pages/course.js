import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Course() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/courses/${id}`); // Replace with your API endpoint
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


  useEffect(() => {
    fetchReviews();
  }, []);
  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3001/reviews/?course_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        throw new Error('Error fetching reviews: ' + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div>
      {data ? (
        <div>
          <h2>id: {data[0].id}</h2>
          <h3>Nome: {data[0].name}</h3>
          <h3>id do depto: {data[0].department}</h3>
          <h3>Número de avaliações: {data[0].review_amount}</h3>
          <h3>Média de avaliacoes: {data[0].average}</h3>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <div>

        {reviews.map((review) => (
        <div key={review.id}>
          <h3>id da avaliação: {review.review_id}</h3>
          <p>id do avaliador: {review.user_id}</p>
          <p>nota do professor: {review.prof_score}</p>
          <p>descrição do professor: {review.prof_txt}</p>
          <p>nota da disciplina: {review.course_score}</p>
          <p>descrição da disciplina: {review.course_txt}</p>
          {/* Display other review data as needed */}
        </div>
      ))}
      
      </div>
    </div>


  );
}

export default Course;
