import React, { useState } from 'react';

const EvalReport = () => {
  const [formData, setFormData] = useState({
    id: '',
    reviewer_id: '',
    accepted: 1
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser) {
      alert('Você precisa estar logado para fazer aceitar uma denúcnia!');
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

      formData.reviewer_id = JSON.parse(sessionStorage.getItem('user')).id

     const { id, ...aux } = formData;


    try {
        console.log("aux:",aux)
      const response = await fetch(`http://localhost:3001/reports/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aux),
      });

      if (response.ok) {
        alert('Denúncia atualizada com sucesso!');
      } else {
        const data = await response.json();
        console.log(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Report ID:
        <input
          type="number"
          name="id"
          value={formData.id}
          onChange={handleChange}
        />
      </label>
      <br />


      <button type="submit">Submit</button>
    </form>
  );
};

export default EvalReport;
