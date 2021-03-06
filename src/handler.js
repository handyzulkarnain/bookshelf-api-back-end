const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  const bookIndex = books.findIndex((book) => book.id === id);

  if (isSuccess) {
    if (books[bookIndex].name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      books.pop();
      response.code(400);
      return response;
    }

    if (books[bookIndex].readPage > books[bookIndex].pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      });
      books.pop();
      response.code(400);
      return response;
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query;

  if (name !== undefined) {
    const loweredName = name.toLowerCase();
    const filteredQueryBooks = books
      .filter((book) => book.name.toLowerCase().includes(loweredName))
      .map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    return {
      status: 'success',
      data: {
        books: filteredQueryBooks,
      },
    };
  }
  if (reading !== undefined) {
    if (reading === '0') {
      const readingBook = false;
      const filteredQueryBooks = books
        .filter((book) => book.reading === readingBook)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      return {
        status: 'success',
        data: {
          books: filteredQueryBooks,
        },
      };
    }
    if (reading === '1') {
      const readingBook = true;
      const filteredQueryBooks = books
        .filter((book) => book.reading === readingBook)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      return {
        status: 'success',
        data: {
          books: filteredQueryBooks,
        },
      };
    }
  }
  if (finished !== undefined) {
    if (finished === '0') {
      const finishedBook = false;
      const filteredQueryBooks = books
        .filter((book) => book.finished === finishedBook)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      return {
        status: 'success',
        data: {
          books: filteredQueryBooks,
        },
      };
    }
    if (finished === '1') {
      const finishedBook = true;
      const filteredQueryBooks = books
        .filter((book) => book.finished === finishedBook)
        .map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }));
      return {
        status: 'success',
        data: {
          books: filteredQueryBooks,
        },
      };
    }
  }

  const filteredBooks = books.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  return {
    status: 'success',
    data: {
      books: filteredBooks,
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const filteredBook = books.filter((b) => b.id === bookId)[0];

  if (filteredBook !== undefined) {
    return {
      status: 'success',
      data: {
        book: filteredBook,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteNoteByIdHandler,
};
