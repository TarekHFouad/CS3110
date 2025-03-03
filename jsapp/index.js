#!/usr/bin/env node

const http = require('http');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');

let dancers = [];

const handleRequest = (req, res) => {
  const [path, query] = req.url.split('?');

  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    let uidMatch = query && query.match(/uid=([0-9a-f-]+)/);

    if (req.method === 'DELETE') {
      if (uidMatch && uidMatch[1]) {
        dancers = dancers.filter(d => d.uid !== uidMatch[1]);
        res.writeHead(200).end();
      } else {
        res.writeHead(400).end();
      }
    } else {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        try {
          const params = JSON.parse(body);
          if (req.method === 'POST' && !uidMatch) {
            const uid = randomUUID();
            dancers.push({ ...params, uid });
            res.writeHead(201).end(uid);
          } else if (req.method === 'PUT' && uidMatch) {
            const i = dancers.findIndex(d => d.uid === uidMatch[1]);
            if (i >= 0) {
              dancers[i] = { ...params, uid: uidMatch[1] };
              res.writeHead(200).end();
            } else {
              res.writeHead(404).end();
            }
          } else {
            res.writeHead(400).end();
          }
        } catch (error) {
          res.writeHead(400).end();
        }
      });
    }
  } else {
    // GET: Return the list of dancers as JSON.
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(dancers));
  }
};

const server = http.createServer(handleRequest);
server.listen(3000, () => console.log('Server listening on port 3000'));
