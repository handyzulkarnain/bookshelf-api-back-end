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

const getAllBooksHandler = () => {
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
  const { id } = request.params;

  const filteredBook = books.filter((b) => b.id === id)[0];

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

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler };
