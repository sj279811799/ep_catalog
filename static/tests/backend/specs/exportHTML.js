'use strict';

const common = require('ep_etherpad-lite/tests/backend/common');
const randomString = require('ep_etherpad-lite/static/js/pad_utils').randomString;

let agent;
const apiKey = common.apiKey;
const apiVersion = 1;

// Creates a pad and returns the pad id. Calls the callback when finished.
const createPad = function (padID, callback) {
  agent.get(`/api/${apiVersion}/createPad?apikey=${apiKey}&padID=${padID}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to create new Pad'));
        callback(padID);
      });
};

const setHTML = function (padID, html, callback) {
  agent.get(`/api/${apiVersion}/setHTML?apikey=${apiKey}&padID=${padID}&html=${html}`)
      .end((err, res) => {
        if (err || (res.body.code !== 0)) callback(new Error('Unable to set pad HTML'));

        callback(null, padID);
      });
};

const getHTMLEndPointFor = function (padID, callback) {
  return `/api/${apiVersion}/getHTML?apikey=${apiKey}&padID=${padID}`;
};


const buildHTML = function (body) {
  return `<html><body>${body}</body></html>`;
};


describe('export image to HTML', function () {
  let padID;
  let html;

  before(async function () { agent = await common.init(); });

  // create a new pad before each test run
  beforeEach(function (done) {
    padID = randomString(5);

    createPad(padID, () => {
      setHTML(padID, html(), done);
    });
  });

  context('when pad contains img', function () {
    before(async function () {
      html = () => buildHTML(`<img src="${uploadSVG}">`);
    });

    it('returns ok', function (done) {
      agent.get(getHTMLEndPointFor(padID))
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('returns HTML with img HTML tags', function (done) {
      agent.get(getHTMLEndPointFor(padID))
          .expect((res) => {
            const html = res.body.data.html;
            const expectedHTML =
              '<img';
            console.warn(res.body.data.html);
            if (html.indexOf(expectedHTML) === -1) throw new Error('No image tag detected');
          })
          .end(done);
    });
  });
});

// eslint-disable-next-line max-len
const uploadSVG = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
