import React, { useState } from 'react';

const Report = () => {
  const [formData, setFormData] = useState({
    user_id: " ",
    review_id: " ",
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform any additional validation or data handling here
    const storedData = sessionStorage.getItem('user');
    if(!storedData){
      alert("Você precisa estar logado para fazer uma denúncia!")
      return;
    }

    formData.user_id = JSON.parse(sessionStorage.getItem('user')).id


    try {
      const response = await fetch('http://localhost:3001/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Sign up successful
        alert('Você fez a denúncia com sucesso');
      } else {
        // Handle error response
        const data = await response.json();
        console.log(data.error);
      }
    } 
    catch (error) {
      // Handle network or other errors
      console.log(error)
    }


  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
         Id da avaliação:
        <input
          type="text"
          name="review_id"
          value={formData.review_id}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
       Motivo
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default Report;
