
export const getBookById = async (bookId, token) => {
    try {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/book/${bookId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch book data');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching book data:', error);
      throw error;
    }
  };
  
  export const getBooksByUsername = async (username, token) => {
    try {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/books/find/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch books');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching books by username:', error);
      throw error;
    }
  };
  
  export const addBook = async (title, author, genre, username, token) => {
    try {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/books/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, author, genre, username }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add book');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  };
  
  export const deleteBook = async (bookId, token) => {
    try {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete book');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  };

  export const getFilteredBooks = async (genre, author, title, token) => {
    try {
      // Construct the query string with only non-empty filters
      const query = new URLSearchParams();
      if (genre) query.append('genre', genre);
      if (author) query.append('author', author);
      if (title) query.append('title', title);
  
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/books/filter?${query.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch filtered books');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error fetching filtered books:', error);
      throw error;
    }
  };
  // Fetch user's books that are not part of any exchange
export const getUnexchangedUserBooks = async (username,token) => {
  try {
      const response = await fetch(`https://${process.env.REACT_APP_SERVER_URL}/books/available/${username}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user books');
      }

      return await response.json();
  } catch (error) {
      console.error('Error fetching user books:', error);
      throw error;
  }
};
