
// Create Book Exchange Request
export const createBookExchange = async (bookIdAskedFor, bookIdSent, fromUsername, toUsername, token) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/book-exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ bookIdAskedFor, bookIdSent, fromUsername, toUsername }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create book exchange');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating book exchange:', error);
    throw error;
  }
};

// Get Received Book Exchanges
export const getReceivedBookExchanges = async (username, token) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/book-exchange/received/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch received book exchanges');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching received book exchanges:', error);
    throw error;
  }
};

// Get Sent Book Exchanges
export const getSentBookExchanges = async (username, token) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/book-exchange/sent/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch sent book exchanges');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sent book exchanges:', error);
    throw error;
  }
};
// Accept Book Exchange
export const acceptBookExchange = async (exchangeId, token) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/book-exchange/accept/${exchangeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to accept book exchange');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error accepting book exchange:', error);
    throw error;
  }
};

// Refuse Book Exchange
export const refuseBookExchange = async (exchangeId, token) => {
  try {
    const response = await fetch(`http://${process.env.REACT_APP_SERVER_URL}/book-exchange/refuse/${exchangeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to refuse book exchange');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error refusing book exchange:', error);
    throw error;
  }
};