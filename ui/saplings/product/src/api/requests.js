/**
 * Copyright 2018-2020 Cargill Incorporated
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function errorResponse(request, message) {
  return {
    ok: false,
    status: request.status,
    statusText: request.statusText,
    headers: request.getAllResponseHeaders(),
    data: message || request.responseText,
    json: JSON.parse(message || request.responseText)
  };
}

export function get(url, protocolVersion) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    if (protocolVersion) {
      request.setRequestHeader('GridProtocolVersion', protocolVersion);
    }
    request.timeout = 5000;

    request.onload = () => {
      return resolve({
        ok: request.status >= 200 && request.status < 300,
        status: request.status,
        statusText: request.statusText,
        headers: request.getAllResponseHeaders(),
        data: request.responseText,
        json: JSON.parse(request.responseText)
      });
    };

    request.onError = () => {
      resolve(errorResponse());
    };

    request.ontimeout = () => {
      resolve(errorResponse(request, 'Request took longer than expected.'));
    };

    request.send();
  });
}
