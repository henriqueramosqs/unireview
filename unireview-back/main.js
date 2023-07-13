const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const port = 3001;


// Create a MySQL connection
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"<senha>",
    database:"<database>"
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) console.error(err);
  console.log('Connected to MySQL server');
});


// Middleware to parse JSON data
app.use(express.json());
app.use(cors())

// Create a user
app.post('/users', (req, res) => {
  const { nome, email ,senha} = req.body;
  const user = { nome, email ,senha};

  connection.query('INSERT INTO User SET ?', user, (err, result) => {
    if (err) throw err;
    console.log('User created');
    res.sendStatus(201);
  });
});

// Get a specific user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('SELECT * FROM User WHERE id = ?', userId, (err, rows) => {
    if (err) throw err;
    if (rows.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(rows[0]);
    }
  });
});

// Get users based on query parameters or retrieve all users
app.get('/users', (req, res) => {
  const { email, senha } = req.query;

  if (email && senha) {
    // Retrieve a specific user by email and password
    connection.query('SELECT * FROM User WHERE email = ? AND senha = ?', [email, senha], (err, rows) => {
      if (err) throw err;
      if (rows.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        res.json(rows[0]);
      }
    });
  } else {
    // Retrieve all users
    connection.query('SELECT * FROM User', (err, rows) => {
      if (err) throw err;
      res.json(rows);
    });
  }
});

app.get('/users/:id/foto', (req, res) => {
  const userId = req.params.id;

  // Retrieve the photo from the database based on the user ID
  // Replace this with your own database query
  const query = `SELECT foto FROM User WHERE id = ${userId}`;

  // Execute the query and retrieve the photo data
  // Replace this with your own database query execution code
  // Assuming you're using a MySQL library such as mysql2
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving photo:', err);
      res.sendStatus(500);
      return;
    }

    if (result.length === 0 || result[0].foto === null) {
      res.sendStatus(404);
      return;
    }

    // Send the photo data as a response
    const photoData = result[0].foto;
    console.log(photoData)
    res.contentType('image/jpeg');
    res.end(photoData, 'binary');
  });
});


// Update a user
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const user = { name, email };

  connection.query('UPDATE User SET ? WHERE id = ?', [user, userId], (err, result) => {
    if (err) throw err;
    console.log('User updated');
    res.sendStatus(200);
  });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM User WHERE id = ?', userId, (err, result) => {
    if (err) throw err;
    console.log('User deleted');
    res.sendStatus(200);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Get all deptos
app.get('/deptos', (req, res) => {
  connection.query('SELECT * FROM Department', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});



// Get certain depto
app.get('/deptos/:id', (req, res) => {

  const {id} = req.params

  connection.query('SELECT * FROM Department WHERE id = ?', id, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

app.get('/reviews', (req, res) => {
  const { professor_id, depto_id, course_id, class_id } = req.query;

  let query = 'SELECT * FROM Review WHERE 1';

  if (professor_id) {
    query += ` AND class_id IN (SELECT id FROM Class WHERE professor_id = ${professor_id})`;
  }

  if (depto_id) {
    query += ` AND class_id IN (SELECT Class.id FROM Course INNER JOIN Class ON Course.id = Class.course_id WHERE Course.department ='${depto_id}')`;
  }

  if (course_id) {
    query += ` AND class_id IN (SELECT id FROM Class WHERE course_id = '${course_id}')`;
  }

  if (class_id) {
    query += ` AND class_id = ${class_id}`;
  }

  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(rows);
  });
});

// post a review
app.post('/reviews', (req, res) => {
  const { user_id, class_id, prof_score, course_score, prof_txt, course_txt } = req.body;

  // Construct the SQL query based on the provided parameters
  let query = 'INSERT INTO Review (user_id, class_id, prof_score, course_score';
  let values = `VALUES (?, ?, ?, ?`;
  const queryValues = [user_id, class_id, prof_score, course_score];

  // Include prof_txt and course_txt if provided
  if (prof_txt) {
    query += ', prof_txt';
    values += ', ?';
    queryValues.push(prof_txt);
  }
  if (course_txt) {
    query += ', course_txt';
    values += ', ?';
    queryValues.push(course_txt);
  }

  query += ') ' + values + ')';

  connection.query(query, queryValues, (err, result) => {
    if (err) throw err;
    console.log('User created');
    res.sendStatus(201);
  });
});
// Delete a review
app.delete('/reviews/:review_id', (req, res) => {
  const { review_id } = req.params;

  connection.query('DELETE FROM Review WHERE review_id = ?', review_id, (err, result) => {
    if (err) {
      console.error('Error deleting review:', err);
      res.status(500).json({ error: 'Failed to delete review' });
    } else {
      console.log('Review deleted');
      res.sendStatus(200);
    }
  });
});

// Get all reports
app.get('/reports', (req, res) => {
  connection.query('SELECT * FROM Report', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Create a report
app.post('/reports', (req, res) => {
  const { user_id, review_id ,reason} = req.body;
  const report = { user_id, review_id ,reason};

  connection.query('INSERT INTO Report SET ?', report, (err, result) => {
    if (err) throw err;
    console.log('User created');
    res.sendStatus(201);
  });
});

// Update report by ID
app.put('/reports/:id', (req, res) => {
  const { id } = req.params;
  const { reviewer_id, accepted } = req.body;

  connection.query(
    'UPDATE Report SET reviewer_id = ?, accepted = ? WHERE id = ?',
    [reviewer_id, accepted, id],
    (err, result) => {
      if (err) {
        console.error('Error updating report:', err);
        res.status(500).json({ message: 'Error updating report' });
        return;
      }
      res.status(200).json({ message: 'Report updated successfully' });
    }
  );
});


// Delete a report
app.delete('/reports/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM Report WHERE id = ?', userId, (err, result) => {
    if (err) throw err;
    console.log('Report deleted');
    res.sendStatus(200);
  });
});




// Get all reviews
app.get('/courses', (req, res) => {
  connection.query('SELECT * FROM Course', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Get a certain course
app.get('/courses/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM Course WHERE id=?',id, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});


// Get all classes
app.get('/classes', (req, res) => {
  connection.query('SELECT * FROM Class', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Get a certain class
app.get('/classes/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM Class WHERE id=?',id, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});



// Get all professors
app.get('/profs', (req, res) => {
  connection.query('SELECT * FROM Professor', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});


// Get professor by id
app.get('/profs/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM Professor WHERE id=?',id, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});


// Get all adminst by
app.get('/admins', (req, res) => {
  connection.query('SELECT * FROM Adms', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});


// Read Administrator
app.get('/admins/:id', (req, res) => {
  const administratorId = req.params.id;
  console.log(administratorId)

  connection.query('SELECT * FROM Adms WHERE id_usuario = ?', administratorId, (err, rows) => {
    if (err) {
      console.error('Error retrieving administrator:', err);
      res.status(500).json({ message: 'Error retrieving administrator' });
      return;
    }
    if (rows.length === 0) {
      res.status(404).json({ message: 'Administrator not found' });
    } else {
      res.json(rows[0]);
    }
  });
});






// Create Administrator
app.post('/admins', (req, res) => {
  const newAdministrator = req.body;

  connection.query('INSERT INTO Adms SET ?', newAdministrator, (err, result) => {
    if (err) {
      console.error('Error creating administrator:', err);
      res.status(500).json({ error: err,message: 'Error creating administrator' });
      return;
    }
    res.status(201).json({ message: 'Administrator created successfully' });
  });
});


// Delete Administrator
app.delete('/admins/:id', (req, res) => {
  const administratorId = req.params.id;

  connection.query('DELETE FROM Adms WHERE id = ?', administratorId, (err, result) => {
    if (err) {
      console.error('Error deleting administrator:', err);
      res.status(500).json({ message: 'Error deleting administrator' });
      return;
    }
    res.json({ message: 'Administrator deleted successfully' });
  });
});