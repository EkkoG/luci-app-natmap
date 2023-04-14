'use strict';
'require form';
'require fs';
'require rpc';
'require view';
'require tools.widgets as widgets';

var callServiceList = rpc.declare({
	object: 'service',
	method: 'list',
	params: ['name'],
	expect: { '': {} }
});

function getInstances() {
	return L.resolveDefault(callServiceList('natmap'), {}).then(function(res) {
		try {
			return res.natmap.instances || {};
		} catch (e) {}
		return {};
	});
}

function getStatus() {
	return getInstances().then(function(instances) {
		var promises = [];
		var status = {};
		for (var key in instances) {
			var i = instances[key];
			if (i.running && i.pid) {
				var f = '/var/run/natmap/' + i.pid + '.json';
				(function(k) {
					promises.push(fs.read(f).then(function(res) {
						status[k] = JSON.parse(res);
					}).catch(function(e){}));
				})(key);
			}
		}
		return Promise.all(promises).then(function() { return status; });
	});
}

return view.extend({
	load: function() {
		return getStatus();
	},
	render: function(status) {
		var m, s, o;

		m = new form.Map('natmap', _('NATMap'));
		s = m.section(form.GridSection, 'natmap');
		s.addremove = true;
		s.anonymous = true;

		o = s.option(form.DummyValue, '_nat_name', _('Name'));
		o.modalonly = false;
		o.textvalue = function(section_id) {
			var s = status[section_id];
			if (s) return s.name;
		};

		o = s.option(form.ListValue, 'mode', _('Mode'));
		o.default = 'general';
		o.modalonly = true;
		o.value('general', _('General'));
		o.value('emby', _('Emby'));
		o.value('qbittorrent', _('qBittorrent'));
		o.value('transmission', _('Transmission'));

		o = s.option(form.Value, 'nat_name', _('Name'));
		o.datatype = 'string';
		o.modalonly = true;

		o = s.option(form.Value, 'emby_url', _('Emby URL'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'emby');

		o = s.option(form.Value, 'emby_api_key', _('Emby API Key'));
		o.datatype = 'host';
		o.modalonly = true;
		o.depends('mode', 'emby');

		o = s.option(form.Flag, 'im_notify_enable', _('Notify'));
		o.default = false;
		o.modalonly = true;

		o = s.option(form.ListValue, 'im_notify_channel', _('Notify channel'));
		o.default = 'telegram_bot';
		o.modalonly = true;
		o.value('telegram_bot', _('Telegram Bot'));
		o.value('pushplus', _('PushPlus'));
		o.depends('im_notify_enable', '1');

		o = s.option(form.Value, 'im_notify_channel_telegram_bot_chat_id', _('Telegram Bot Chat ID'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('im_notify_channel', 'telegram_bot');

		o = s.option(form.Value, 'im_notify_channel_telegram_bot_token', _('Telegram Bot Token'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('im_notify_channel', 'telegram_bot');

		o = s.option(form.Value, 'im_notify_channel_pushplus_token', _('PushPlus Token'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('im_notify_channel', 'pushplus');
		
		o = s.option(form.Value, 'qb_web_ui_url', _('qBittorrent Web UI URL'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'qbittorrent');
		
		o = s.option(form.Value, 'qb_username', _('qBittorrent Username'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'qbittorrent');

		o = s.option(form.Value, 'qb_password', _('qBittorrent Password'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'qbittorrent');

		o = s.option(form.Flag, 'qb_allow_ipv6', _('qBittorrent Allow IPv6'));
		o.default = false;
		o.modalonly = true;
		o.depends('mode', 'qbittorrent');

		o = s.option(form.Value, 'qb_ipv6_address', _('qBittorrent IPv6 Address'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('qb_allow_ipv6', '1');

		o = s.option(form.Value, 'tr_rpc_url', _('Transmission RPC URL'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'transmission');
		
		o = s.option(form.Value, 'tr_username', _('Transmission Username'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'transmission');

		o = s.option(form.Value, 'tr_password', _('Transmission Password'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('mode', 'transmission');

		o = s.option(form.Flag, 'tr_allow_ipv6', _('Transmission Allow IPv6'));
		o.modalonly = true;
		o.default = false;
		o.depends('mode', 'transmission');

		o = s.option(form.Value, 'tr_ipv6_address', _('Transmission IPv6 Address'));
		o.datatype = 'string';
		o.modalonly = true;
		o.depends('tr_allow_ipv6', '1');

		o = s.option(form.ListValue, 'udp_mode', _('Protocol'));
		o.default = '1';
		o.value('0', 'TCP');
		o.value('1', 'UDP');
		o.textvalue = function(section_id) {
			var cval = this.cfgvalue(section_id);
			var i = this.keylist.indexOf(cval);
			return this.vallist[i];
		};

		o = s.option(form.ListValue, 'family', _('Restrict to address family'));
		o.modalonly = true;
		o.value('', _('IPv4 and IPv6'));
		o.value('ipv4', _('IPv4 only'));
		o.value('ipv6', _('IPv6 only'));

		o = s.option(widgets.NetworkSelect, 'interface', _('Interface'));
		o.modalonly = true;

		o = s.option(form.Value, 'interval', _('Keep-alive interval'));
		o.datatype = 'uinteger';
		o.modalonly = true;

		o = s.option(form.Value, 'stun_server', _('STUN server'));
		o.datatype = 'host';
		o.modalonly = true;
		o.optional = false;
		o.rmempty = false;

		o = s.option(form.Value, 'http_server', _('HTTP server'), _('For TCP mode'));
		o.datatype = 'host';
		o.modalonly = true;
		o.rmempty = false;

		o = s.option(form.Value, 'port', _('Bind port'));
		o.datatype = 'port';
		o.rmempty = false;

		o = s.option(form.Flag, '_forward_mode', _('Forward mode'));
		o.modalonly = true;
		o.ucioption = 'forward_target';
		o.load = function(section_id) {
			return this.super('load', section_id) ? '1' : '0';
		};
		o.write = function(section_id, formvalue) {};

		o = s.option(form.Value, 'forward_target', _('Forward target'));
		o.datatype = 'host';
		o.modalonly = true;
		o.depends('_forward_mode', '1');

		o = s.option(form.Value, 'forward_port', _('Forward target port'), _('0 will forward to the out port get from STUN'));
		o.datatype = 'port';
		o.modalonly = true;
		o.depends('_forward_mode', '1');

		o = s.option(form.Flag, 'forward_use_natmap', _('Forward use natmap'));
		o.editable = true;
		o.default = false;
		o.modalonly = true;

		o = s.option(form.Value, 'notify_script', _('Notify script'));
		o.datatype = 'file';
		o.modalonly = true;

		o = s.option(form.DummyValue, '_external_ip', _('External IP'));
		o.modalonly = false;
		o.textvalue = function(section_id) {
			var s = status[section_id];
			if (s) return s.ip;
		};

		o = s.option(form.DummyValue, '_external_port', _('External Port'));
		o.modalonly = false;
		o.textvalue = function(section_id) {
			var s = status[section_id];
			if (s) return s.port;
		};

		o = s.option(form.Flag, 'enable', _('Enable'));
		o.editable = true;
		o.modalonly = false;

		return m.render();
	}
});
