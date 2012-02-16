#pragma once

#include "../include/afanasy.h"

#include "../libafanasy/dlThread.h"
#include "../libafanasy/msgclasses/mctaskpos.h"
#include "../libafanasy/name_af.h"
#include "../libafanasy/service.h"
#include "../libafanasy/taskexec.h"

#include "childprocess.h"

class ParserHost;

class TaskProcess
{
public:
    TaskProcess( af::TaskExec * i_taskExec);
    ~TaskProcess();

    inline bool is( int i_jobId, int i_blockNum, int i_taskNum, int i_Number) const
        { return ((m_taskexec->getJobId() == i_jobId) &&
                  (m_taskexec->getBlockNum() == i_blockNum) &&
                  (m_taskexec->getTaskNum() == i_taskNum) &&
                  (m_taskexec->getNumber() == i_Number));}

    inline bool is( const af::MCTaskPos & i_taskpos) const
        { return is( i_taskpos.getJobId(), i_taskpos.getNumBlock(), i_taskpos.getNumTask(), i_taskpos.getNumber());}

    void getOutput( af::Msg & msg) const;

    void stop( bool noStatusUpdate = false);

    void refresh();

    inline bool isZombie() const { return m_zombie;}

private:
    void sendTaskSate();
    void readProcess();
    void processFinished( int exitCode);
    void killProcess();

private:
    af::TaskExec * m_taskexec;
    af::Service m_service;
    ParserHost * m_parser;
    uint8_t m_update_status;
    time_t m_stop_time;
    bool m_zombie;

    pid_t m_pid;
#ifdef WINNT
    PROCESS_INFORMATION * process_info;
    HANDLE hJob;
 #endif

    FILE * m_io_output;
    FILE * m_io_outerr;
    FILE * m_io_input;

    // Read buffer:
    static const int m_readbuffer_size = AFRENDER::TASK_READ_BUFFER_SIZE;
    char m_readbuffer[m_readbuffer_size];
    // Will be set to FILEs:
    char m_filebuffer_out[m_readbuffer_size];
    char m_filebuffer_err[m_readbuffer_size];
};
