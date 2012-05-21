function RendersList( parentElement)
{
	this.parentElement = parentElement;
	this.valid = false;
	this.name = 'renders';
	for( i = 0; i < g_recievers.lenght; i++)
	{
		if( g_recievers[i].name == this.name )
		{
			info('ERROR: Renders list already exists.');
			return;
		}
	}
	g_recievers.push( this);
	g_updaters.push( this);
	g_monitors.push( this);

	this.items = [];

	subscribe('renders');

	getNodes('renders');
}

RendersList.prototype.destroy = function()
{
	for( i = 0; i < this.items.length; i++)
		this.parentElement.removeChild(this.items[i].element);
	this.items = [];
	g_recievers = [];
	g_updaters = [];
	g_monitors = [];
}

RendersList.prototype.update = function()
{
}

RendersList.prototype.processMsg = function( obj)
{
	if( obj.events != null )
	{
		this.delNodes( obj.events.renders_del);
		ids = mergeIds( obj.events.renders_change, obj.events.renders_add);
		if( ids.length > 0 )
			getNodes('renders', ids);
		return;
	}

	if( obj.renders == null )
		return;

	var new_ids = [];
	var updated = 0;

	for( j = 0; j < obj.renders.length; j++)
	{
		founded = false;
		for( i = 0; i < this.items.length; i++)
		{
			if( this.items[i].params.id == obj.renders[j].id )
			{
				this.items[i].update( obj.renders[j]);
				founded = true;
				updated = updated + 1;
				break;
			}
		}
		if( founded == false )
			new_ids.push(j);
	}

	for( i = 0; i < new_ids.length; i++)
	{
		this.items.push( new RenderNode(obj.renders[new_ids[i]], this.parentElement));
	}

info('c' + g_cycle + ' renders processed ' + obj.renders.length + ': old:' + this.items.length + ' new:' + new_ids.length + ' up:' + updated);
}

RendersList.prototype.delNodes = function( i_ids)
{
	if( i_ids == null ) return;
	if( i_ids.length == null ) return;
	if( i_ids.length == 0 ) return;
	if( this.items.length == 0 ) return;

	for( d = 0; d < i_ids.length; d++ )
		for( i = 0; i < this.items.length; i++)
			if( this.items[i].params.id == i_ids[d] )
			{
				this.parentElement.removeChild(this.items[i].element);
				this.items.splice(i,1);
				break;
			}

info('c' + g_cycle + ' renders size after deletion = ' + this.items.length);
}

function RenderNode( obj, parentElement)
{
	this.parentElement = parentElement;
	this.element = document.createElement('div');
//	this.element.className = 'item';
	this.element.onmousedown=cm_ItemMouseDown;
	this.element.onmouseover=cm_ItemMouseOver;
//	this.element.node = this;
	this.parentElement.appendChild(this.element);

	this.name = document.createElement('span');
	this.element.appendChild( this.name);
	this.name.title = 'Client host name';

	this.version = document.createElement('span');
	this.element.appendChild( this.version);
	this.version.title = 'Client version';

	this.priority = document.createElement('span');
	this.element.appendChild( this.priority);
	this.priority.style.cssFloat = 'right';
	this.priority.title = 'Priority';

	this.user_name = document.createElement('span');
	this.element.appendChild( this.user_name);
	this.user_name.style.cssFloat = 'right';
	this.user_name.title = 'User name and "Nimby" status'

	this.center = document.createElement('span');
	this.element.appendChild( this.center);
	this.center.className = 'resources';

	this.element.appendChild( document.createElement('br'));

	this.capacity = document.createElement('span');
	this.element.appendChild( this.capacity);
	this.capacity.title = 'Capacity used / total'

	this.max_tasks = document.createElement('span');
	this.element.appendChild( this.max_tasks);
	this.max_tasks.title = 'Running tasks / maximum'

	this.state = document.createElement('span');
	this.element.appendChild( this.state);
	this.state.style.cssFloat = 'right';
	this.state.title = 'Busy / free status and time';

	this.update( obj);
}

RenderNode.prototype.update = function( obj)
{
	this.params = obj

	var user = obj.user_name;

	if( obj.offline === true )
	{
		if( false == this.element.classList.contains('offline'))
		this.element.classList.add('offline');
	}
	else
		this.element.classList.remove('offline');

	if( obj.busy === true )
	{
		if( false == this.element.classList.contains('running'))
		this.element.classList.add('running');
	}
	else
		this.element.classList.remove('running');

	if( obj.NIMBY === true )
	{
		if( false == this.element.classList.contains('nimby'))
			this.element.classList.add('nimby');
		user = '(' + user + ')N';
	}
	else if( obj.nimby === true )
	{
		if( false == this.element.classList.contains('nimby'))
			this.element.classList.add('nimby');
		user = '(' + user + ')n';
	}
	else
		this.element.classList.remove('nimby');

	this.name.innerHTML = obj.name;
	if( obj.version != null )
		this.version.innerHTML = ' ' + obj.version;
	else
		this.version.innerHTML = '';

	this.priority.innerHTML = '-' + obj.priority;

	this.user_name.innerHTML = user;

	if( obj.offline === true )
	{
		this.center.innerHTML = 'offline';
		this.capacity.innerHTML = '';
		this.max_tasks.innerHTML = '';
		this.state.innerHTML = '';
		return;
	}
	this.center.innerHTML = '.';

	var capacity = obj.capacity;
	if( capacity == null )
		capacity = obj.host.capacity;
	capacity = obj.capacity_used + '/' + capacity;
	this.capacity.innerHTML = capacity;

	var max_tasks = obj.max_tasks;
	if( max_tasks == null )
		max_tasks = obj.host.max_tasks;
	if( obj.busy === true )
		max_tasks = '(' + obj.tasks.length + '/' + max_tasks + ')';
	else
		max_tasks = '(0/' + max_tasks + ')';
	max_tasks = ' ' + max_tasks;
	this.max_tasks.innerHTML = max_tasks;

	var state = 'NEW';
	if(( obj.task_start_finish_time != null ) && ( obj.task_start_finish_time > 0 ))
	{
		state = timeStringFromNow( obj.task_start_finish_time);
		if( obj.busy === true )
			state += ' busy';
		else
			state += ' free';
	}
	this.state.innerHTML = state;
}
