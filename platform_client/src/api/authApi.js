export const login = async (username, password) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login Failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const signup = async (username, password, firstName, lastName) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, firstName, lastName }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};
