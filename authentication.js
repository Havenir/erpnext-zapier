/*
Zapier App to automate ERPNext.
Copyright(C) 2019 Raffael Meyer <raffael@alyf.de>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
'use strict';

const { OAUTH_TOKEN_METHOD, OAUTH_TEST_METHOD } = require('./constants');

const { getAuthorizeRequest, getMethod, postMethod } = require('./api');

module.exports = {
  type: 'oauth2',
  fields: [
    {
      computed: false,
      key: 'BASE_URL',
      type: 'string',
      required: true,
      helpText:
        'The base URL of your ERPNext instance.\nFor example https://demo.erpnext.com (without trailing slash).',
    },
    {
      computed: false,
      key: 'CLIENT_ID',
      type: 'string',
      required: true,
      helpText: 'Your OAuth Client ID for this app',
    },
    {
      computed: false,
      key: 'CLIENT_SECRET',
      type: 'password',
      required: true,
      helpText: 'Your Oauth Client Secret for this app',
    },
  ],
  oauth2Config: {
    authorizeUrl: getAuthorizeRequest(),
    getAccessToken: (z, bundle) => {

      formData.append("code", bundle.authData.code)
      formData.append("client_id", bundle.authData.CLIENT_ID)
      formData.append("client_secret", bundle.authData.CLIENT_SECRET)
      formData.append("grant_type", 'authorization_code')
      formData.append("redirect_uri", bundle.inputData.redirect_uri)

      return postMethod(z, bundle.authData.BASE_URL, OAUTH_TOKEN_METHOD, formData).then(response => {
        return response;
      });
    },
    refreshAccessToken: (z, bundle) => {
      let formData = new FormData()
      formData.append("refresh_token", bundle.authData.refresh_token)
      formData.append("client_id", bundle.authData.CLIENT_ID)
      formData.append("client_secret", bundle.authData.CLIENT_SECRET)
      formData.append("grant_type", 'refresh_token')
      formData.append("redirect_uri", bundle.inputData.redirect_uri)

      return postMethod(z, bundle.authData.BASE_URL, OAUTH_TOKEN_METHOD, formData);
    },
    autoRefresh: true,
    scope: 'all',
  },
  // OAUTH_TEST_METHOD returns { "message": "user@example.com" }
  test: z => getMethod(z, OAUTH_TEST_METHOD),
  connectionLabel: '{{message}}',
};
