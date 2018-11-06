const yapi = require('yapi.js');
const sync_Model = require('./syncModel.js');
const interface_Model = require('models/interface.js');
const project_Model = require('models/project.js');
const interfaceModel = yapi.getInst(interface_Model);
const projectModel = yapi.getInst(project_Model);
const syncModel = yapi.getInst(sync_Model);

let pluginConf = {}

async function addMock(interfaceid, projectId, method, apiurl) {
    // let envData = await projectModel.getByEnv(projectId);
    let projectInfo = await projectModel.get(projectId);
    let host, basepath;
    try {
        if (projectInfo) {
            basepath = projectInfo.basepath;
            host = projectInfo.env[0].domain;
            host = host.replace(/(.*:\/\/)/ig, '');
        }
    } catch (ex) {
        yapi.commons.log(ex, 'error');
    }

    syncModel.addMock(pluginConf, interfaceid, projectId, basepath, host, method, apiurl, 1);
}

async function removeMock(interfaceid) {
    syncModel.removeMock(pluginConf, interfaceid, 1);
}

async function setProject(projectId) {
    try {
        let projectInfo = await projectModel.get(projectId);
        let host, basepath;
        try {
            if (projectInfo) {
                basepath = projectInfo.basepath;
                host = projectInfo.env[0].domain;
                host = host.replace(/(.*:\/\/)/ig, '');
            }
        } catch (ex) {
            yapi.commons.log(ex, 'error');
        }
        syncModel.setProject(pluginConf, projectId, host, basepath);
    } catch (error) {
        yapi.commons.log(error, 'error');
    }
}

async function getInterface(id) {
    let result = await interfaceModel.get(id);
    return result;
}

module.exports = function (options) {
    const {
        addApi,
        removeApi,
        setProjectApi
    } = options;
    pluginConf.addApi = addApi;
    pluginConf.removeApi = removeApi;
    pluginConf.setProjectApi = setProjectApi;

    this.bindHook('interface_update', async (interfaceId) => {
        return new Promise(async (resolve, reject) => {
            let interfaceInfo = await getInterface(interfaceId);
            if (!interfaceInfo || interfaceInfo._id <= 0) {
                reject('接口未找到');
            }

            if (interfaceInfo.res_body) {
                await addMock(
                    interfaceInfo._id,
                    interfaceInfo.project_id,
                    interfaceInfo.method,
                    interfaceInfo.path
                );
            } else {
                await removeMock(interfaceInfo._id);
            }
            // console.log('-------sync interface:', addApi, JSON.stringify(options), interfaceInfo);
            resolve();
        });
    });

    this.bindHook('interface_del', async (interface) => {
        return new Promise(async (resolve) => {
            await removeMock(interface._id);
            resolve();
        });
    });


    //自定义钩子(项目修改成功)
    this.bindHook('project_up', async (projectId) => {
        return new Promise(async (resolve) => {
            await setProject(projectId);
            resolve();
        });
    });



}
