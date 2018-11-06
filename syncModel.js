const yapi = require('yapi.js');
const req = require('request');

class syncModel {
  addMock(pluginConf, interfaceid, projectId, basepath, host, method, apiurl, mocktype) {
    try {
      let reqData = {
        interfaceid: interfaceid,
        projectid: projectId,
        basepath: basepath,
        host: host,
        method: method,
        apiurl: apiurl,
        mocktype: mocktype
      };
      req.post({
        url: pluginConf.addApi,
        form: reqData
      }, function (err, res, body) {
        let reData;
        if (body) {
          reData = JSON.parse(body);
        }
        if (!reData || reData.returncode != 0) {
          yapi.commons.log(
            'addMock:interfaceid=' + interfaceid + ';reqData:' + JSON.stringify(reqData) + ';body:' + body, 'error');
        }
      });
    } catch (ex) {
      yapi.commons.log(ex, 'error');
    }
  }

  removeMock(pluginConf, interfaceid, mocktype) {
    try {
      let reqData = {
        interfaceid: interfaceid,
        mocktype: mocktype
      };
      req.post({
        url: pluginConf.removeApi,
        form: reqData
      }, function (err, res, body) {
        let reData;
        if (body) {
          reData = JSON.parse(body);
        }
        if (!reData || reData.returncode != 0) {
          yapi.commons.log(
            'removeMock:interfaceid=' + interfaceid + ';reqData:' + JSON.stringify(reqData) + ';body:' + body, 'error');
        }
      });
    } catch (ex) {
      yapi.commons.log(ex, 'error');
    }
  }

  setProject(pluginConf, projectId, host, basepath) {
    try {
      let reqData = {
        projectid: projectId,
        host: host,
        basepath: basepath
      };
      req.post({
        url: pluginConf.setProjectApi,
        form: reqData
      }, function (err, res, body) {
        let reData;
        if (body) {
          reData = JSON.parse(body);
        }
        if (!reData || reData.returncode != 0) {
          yapi.commons.log(
            'setProject:projectId=' + projectId + ';reqData:' + JSON.stringify(reqData) + ';body:' + body, ';error');
        }
      });
    } catch (ex) {
      yapi.commons.log(ex, 'error');
    }
  }

}

module.exports = syncModel;