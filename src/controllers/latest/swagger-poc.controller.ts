import { Context } from 'koa';
import { v4 as uuidv4 } from 'uuid';

// Mock data store
const users: any[] = [];

export const create = async (ctx: Context) => {
  const { name, email, age } = ctx.request.body;

  const user = {
    id: uuidv4(),
    name,
    email,
    age,
    createdAt: new Date().toISOString()
  };

  users.push(user);

  ctx.status = 201;
  ctx.body = user;
};

export const findById = async (ctx: Context) => {
  const { id } = ctx.params;

  const user = users.find(u => u.id === id);
  
  if (!user) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
      details: `User with ID ${id} not found`
    };
    return;
  }

  ctx.body = user;
};

export const list = async (ctx: Context) => {
  const { limit = 10, offset = 0 } = ctx.query;

  const paginatedUsers = users.slice(Number(offset), Number(offset) + Number(limit));

  ctx.body = {
    users: paginatedUsers,
    total: users.length,
    limit: Number(limit),
    offset: Number(offset)
  };
};

export const update = async (ctx: Context) => {
  const { id } = ctx.params;
  const { name, email, age } = ctx.request.body;

  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
      details: `User with ID ${id} not found`
    };
    return;
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    age: age || users[userIndex].age
  };

  ctx.body = users[userIndex];
};

export const remove = async (ctx: Context) => {
  const { id } = ctx.params;

  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    ctx.status = 404;
    ctx.body = {
      error: 'User not found',
      details: `User with ID ${id} not found`
    };
    return;
  }

  users.splice(userIndex, 1);
  ctx.status = 204;
};