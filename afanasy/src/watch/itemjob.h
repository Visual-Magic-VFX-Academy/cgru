#pragma once

#include "../libafanasy/job.h"

#include "itemwork.h"
#include "blockinfo.h"

class ItemButton;
class ListJobs;

class ItemJob : public ItemWork
{
public:
	ItemJob(ListNodes * i_listnodes, bool i_inworklist, af::Job *job, const CtrlSortFilter * i_ctrl_sf, bool i_notify);
	~ItemJob();

	void v_updateValues(af::Node * i_afnode, int i_msgType);

	void v_toBeDeleted();

	int maxrunningtasks;
	int maxruntasksperhost;
	int64_t state;
	int64_t time_creation;
	int64_t time_started;
	int64_t time_wait;
	int64_t time_done;
	uint32_t time_run;
	int lifetime;

	bool ppapproval;
	bool maintenance;
	bool ignorenimby;
	bool ignorepaused;

	bool has_tasks_trying_next;

	QString pools;
	QString service;
	QString hostname;
	QString username;
	QString branch;
	QString hostsmask;
	QString hostsmask_exclude;
	QString dependmask;
	QString dependmask_global;
	QString need_os;
	QString need_properties;
	QString cmd_pre;
	QString cmd_post;
	QString description;
	QString thumb_path;
	QString report;
	QString project;
	QString department;
	QMap<QString,QString> folders;

	const QString getRulesFolder();

	inline int getBlocksNum() const {return m_blocks.size();}

	inline const BlockInfo * getBlockInfo(int i_bnum) const {
		if (i_bnum < 0) return m_blocks[0];
		if (i_bnum < m_blocks.size()) return m_blocks[i_bnum];
		return NULL;}

	inline int getBlockPercent(int i_bnum) const
		{if (i_bnum < m_blocks.size()) return m_blocks[i_bnum]->p_percentage; else return 0;}

	void v_setSortType(int type1, int i_type2);
	void v_setFilterType(int type);

	inline const QString & getBlockName(int i_bnum) const {return m_blocks[i_bnum]->getName();}

	bool calcHeight();

	virtual void v_filesReceived(const af::MCTaskUp & i_taskup);

	void getThumbnail() const;

	void v_buttonClicked(ItemButton * i_b);

protected:
	virtual void v_paint(QPainter * i_painter, const QRect & i_rect, const QStyleOptionViewItem & i_option) const;

private:
	static const int Height;
	static const int HeightThumbName;
	static const int HeightAnnotation;

private:
	void updateInfo(const af::Job * i_job);

	int drawButtons(QPainter * i_painter, const QRect & i_rect, const QStyleOptionViewItem & i_option, const QColor * i_clrItem) const;

	void setItemCollapsed(bool i_collapse);

private:
	int64_t m_serial;

	bool m_inworklist;

	int m_buttons_width;

	bool m_item_collapsed;
	ItemButton * m_btn_item_collapse;
	ItemButton * m_btn_item_expand;

	bool m_compact_display;

	QString m_str_props;
	QString m_str_user_eta;
	QString m_str_runningTime;

	int m_num_runningtasks;

	int m_tasks_done;

	QList<QImage*> m_thumbs;
	QList<QString> m_thumbs_paths;

	int m_block_height;

	QVector<BlockInfo*> m_blocks;
};
