import { log } from '../utils/logger'

export const selectById = (id: string) => {
  return {
    text: `SELECT *
     FROM counter
     WHERE counter.id = $1`,
    values: [id],
  }
}

export const create = ({ id }: { id?: string }) => {
  if (id) {
    log('create', { id })
    return {
      text: 'INSERT INTO counter SET id = $1 RETURNING *',
      values: [id],
    }
  } else {
    log('create')
    return {
      text: 'INSERT INTO counter DEFAULT VALUES RETURNING *',
      values: [],
    }
  }
}

export const list = () => {
  log('list')
  return {
    text: `SELECT
       *
      FROM counter`,
    values: [],
  }
}

export const addValue = ({ id }: { id: string }) => {
  log('add value', { id })
  return {
    text: `
    UPDATE counter
    SET value = value + 1
    WHERE id = $1
    RETURNING *`,
    values: [id],
  }
}

export const resetCounter = ({ id }: { id: string }) => {
  log('add value', { id })
  return {
    text: `UPDATE counter
            SET value = 0
            WHERE id = $1
            RETURNING *`,
    values: [id],
  }
}

export const deleteCounter = ({ id }: { id: string }) => {
  log('add value', { id })
  return {
    text: `UPDATE counter
            SET value = 0
            WHERE id = $1
            RETURNING *`,
    values: [id],
  }
}
