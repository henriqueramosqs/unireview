import React, { useState } from 'react';

const AddReview = () => {
  const [formData, setFormData] = useState({
    user_id: " ",
    class_id: '',
    prof_score: '',
    prof_txt: '',
    course_score: '',
    course_txt: ''
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
      alert("Você precisa estar logado para fazer uma review!")
      return;
    }

    formData.user_id = JSON.parse(sessionStorage.getItem('user')).id
    console.log(formData)
    try {
      const response = await fetch('http://localhost:3001/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Sign up successful
        alert('Sign up successful!');
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
        Class ID:
        <input
          type="text"
          name="class_id"
          value={formData.class_id}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Professor Score (0-10):
        <input
          type="number"
          name="prof_score"
          min="0"
          max="10"
          step="0.1"
          value={formData.prof_score}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Professor Text:
        <input
          type="text"
          name="prof_txt"
          value={formData.prof_txt}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Class Score (0-10):
        <input
          type="number"
          name="course_score"
          min="0"
          max="10"
          step="0.1"
          value={formData.course_score}
          onChange={handleChange}
        />
      </label>
      <br />

      <label>
        Class Text:
        <input
          type="text"
          name="course_txt"
          value={formData.course_txt}
          onChange={handleChange}
        />
      </label>
      <br />

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddReview;
