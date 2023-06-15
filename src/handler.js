const { payload } = require('@hapi/hapi/lib/validation');
const { nanoid } = require('nanoid');
const Books = require('./Books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    const isNoName = Books.filter((Book) => Book.name === undefined);
    const { payload } = request;

    if (payload.name===undefined) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }

    if (payload.readPage>payload.pageCount) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }

    Books.push(newBook);
    const isSuccess = Books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
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
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response; 

};

const getAllBooksHandler = () => ({
    status: 'success',
    data: {
      books: Books.map((Book) => ({
        id: Book.id,
        name: Book.name,
        publisher: Book.publisher,
    })),
  },
});

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const Book = Books.filter((n) => n.id === id)[0];
 
 if (Book !== undefined) {
    return {
      status: 'success',
      data: {
        book: Book,
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
  const { id } = request.params;
 
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const updatedAt = new Date().toISOString();
 
  const index = Books.findIndex((Book) => Book.id === id);
  const { payload } = request;

  if (payload.name!==undefined && payload.readPage<=payload.pageCount && index !== -1) {
    Books[index] = {
      ...Books[index],
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
    response.code(200);
    return response;
  }

  if (payload.name===undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
  
  if (payload.readPage>payload.pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
  
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
 
  const index = Books.findIndex((Book) => Book.id === id);
 
  if (index !== -1) {
    Books.splice(index, 1);
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
 
module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };
