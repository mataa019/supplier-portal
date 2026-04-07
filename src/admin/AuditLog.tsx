

import { useEffect, useState } from 'react';
import { Tag,  } from 'antd';
import { getAuditLogs, getAuditLogById } from '../apiservice/adminServices';
import type { AuditLog } from '../apiservice/adminModels';
function prettyJson(obj: any) {
  return <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 p-2 rounded max-w-full overflow-x-auto">{JSON.stringify(obj, null, 2)}</pre>;
}

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

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<AuditLogMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

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

  const handleRowClick = async (record: AuditLog) => {
    setDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const log = await getAuditLogById(record.id);
      setSelectedLog(log);
    } catch {
      setSelectedLog(null);
    } finally {
      setDetailLoading(false);
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
            onRow={(record) => ({ onClick: () => handleRowClick(record), style: { cursor: 'pointer' } })}
          />
        )}
      </div>

      <Modal
        open={detailModalOpen}
        onCancel={() => { setDetailModalOpen(false); setSelectedLog(null); }}
        title="Audit Log Details"
        footer={null}
        width={600}
      >
        {detailLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : selectedLog ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="ID">{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label="Date/Time">{new Date(selectedLog.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="User">{selectedLog.user ? `${selectedLog.user.email} (${selectedLog.user.role})` : 'System'}</Descriptions.Item>
            <Descriptions.Item label="Action">{selectedLog.action}</Descriptions.Item>
            <Descriptions.Item label="Entity">{selectedLog.entity}</Descriptions.Item>
            <Descriptions.Item label="Entity ID">{selectedLog.entityId || '-'}</Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedLog.ipAddress || '-'}</Descriptions.Item>
            <Descriptions.Item label="Details">{selectedLog.details ? prettyJson(selectedLog.details) : '-'}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div className="text-center text-gray-500">Failed to load details.</div>
        )}
      </Modal>
    </div>
  );

