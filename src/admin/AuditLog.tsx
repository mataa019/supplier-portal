

import React, { useEffect, useState } from 'react';
import { Table, Spin, Tag } from 'antd';
import { getAuditLogs } from '../apiservice/adminServices';
import type { AuditLog, AuditLogMeta } from '../apiservice/adminServices';

const columns = [
  {
    title: 'Date/Time',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (text: string) => new Date(text).toLocaleString(),
    sorter: (a: AuditLog, b: AuditLog) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    defaultSortOrder: 'descend' as const,
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (user: AuditLog['user']) => user ? (
      <span className="font-medium text-gray-800">{user.email} <span className="text-xs text-gray-400">({user.role})</span></span>
    ) : <span className="text-xs text-gray-400">System</span>,
  },
  {
    title: 'Action',
    dataIndex: 'action',
    key: 'action',
    render: (action: string) => <Tag color="blue">{action}</Tag>,
  },
  {
    title: 'Entity',
    dataIndex: 'entity',
    key: 'entity',
    render: (entity: string) => <span className="text-gray-700">{entity}</span>,
  },
  {
    title: 'Entity ID',
    dataIndex: 'entityId',
    key: 'entityId',
    render: (id: string) => id ? <span className="text-xs text-gray-500">{id}</span> : <span className="text-xs text-gray-400">-</span>,
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    render: (details: any) => details ? (
      <span className="text-xs text-gray-600">{typeof details === 'object' ? JSON.stringify(details) : String(details)}</span>
    ) : <span className="text-xs text-gray-400">-</span>,
  },
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<AuditLogMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchLogs = async (pageNum = 1, limit = 20) => {
    setLoading(true);
    try {
      const res = await getAuditLogs({ page: pageNum, limit });
      setLogs(res.data);
      setMeta(res.meta);
    } catch {
      setLogs([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-gray-900">Audit Log</h1>
      <p className="text-gray-500 mb-6">Track all important actions and changes in the system for transparency and accountability.</p>
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={logs}
            rowKey="id"
            pagination={{
              current: page,
              pageSize,
              total: meta?.total || 0,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
              onChange: (p, ps) => {
                setPage(p);
                setPageSize(ps);
              },
            }}
            bordered
            size="middle"
          />
        )}
      </div>
    </div>
  );
}
