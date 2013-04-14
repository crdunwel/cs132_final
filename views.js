var env;

/**
 * Primary rendering function
 *
 * @param response  Object  Function passed from callback
 * @param pageName  String  Name of page to render
 * @param kwargs    Object  Optional arguments for template as javascript object
 */
function render(response, pageName, kwargs)
{
    console.log('Rendering ' + pageName);
    var start = Date.now();
    kwargs = kwargs == 'undefined' ? {}:kwargs;
    response.render('./'+pageName+'/'+pageName+'.html', kwargs);
    console.log('Page rendered in ' + ((Date.now()-start)/1000) + " seconds");
}

function ajaxRender(response, pageName, kwargs)
{
    kwargs = kwargs == 'undefined' ? {}:kwargs;
    var bodyTemplate = env.getTemplate('./'+pageName+'/'+pageName+'-body.html');
    return bodyTemplate.render(kwargs);
}


// Object to map pages to output.
module.exports =
{
    setEnvironment: function(environment)
    {
        env = environment;
    },

    mainPage: function mainPage(request, response)
    {
        response.render('root.html',{});
    },

    techPage: function techPage(request, response)
    {
        response.render('root.html',{'body':'../technicianside/index.html'});
    },

    clientPage: function clientPage(request, response)
    {
        render(response, arguments.callee.name);
    }

};

// AUXILLARY FUNCTIONS

/**
 * This is a reverse hash map lookup function
 *
 * @param fn
 * @return {*}
 */
function name(fn) { for (var o in module.exports) { if (fn===module.exports[o]) {return o} }}

/**
 * Merges two javascript objects into one
 *
 * @return {Object}
 */
function objectMerge()
{
    var out = {};
    if(!arguments.length) { return out; }
    for(var i=0; i<arguments.length; i++)
    {
        for(var key in arguments[i])
        {
            out[key] = arguments[i][key];
        }
    }
    return out;
}


