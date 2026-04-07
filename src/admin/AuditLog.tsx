import React, { useEffect, useState } from 'react';
import { Table, Spin, Tag } from 'antd';
import { getAuditLogs } from '../apiservice/adminServices';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  timestamp: string;
  details?: string;
}

const columns = [
  {
    title: 'Date/Time',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text: string) => new Date(text).toLocaleString(),
    sorter: (a: AuditLog, b: AuditLog) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    defaultSortOrder: 'descend' as const,
  },
  {
    title: 'User',
    dataIndex: 'user',
    key: 'user',
    render: (user: string) => <span className="font-medium text-gray-800">{user}</span>,
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
    render: (id: string) => <span className="text-xs text-gray-500">{id}</span>,
  },
  {
    title: 'Details',
    dataIndex: 'details',
    key: 'details',
    render: (details?: string) => details ? <span className="text-xs text-gray-600">{details}</span> : <span className="text-xs text-gray-400">-</span>,
  },
];

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAuditLogs()
      .then((data) => setLogs(data))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

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
            pagination={{ pageSize: 20 }}
            bordered
            size="middle"
          />
        )}
      </div>
    </div>
  );
}
