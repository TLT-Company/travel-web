'use client';

import { useState } from 'react';
import Button from '../ui/button/Button';

const mockData = [
  {
    id: 'TH001',
    createdAt: '2024-01-01',
    customerCount: 5,
    status: 'Đang hoạt động',
  },
  {
    id: 'TH002',
    createdAt: '2024-03-15',
    customerCount: 2,
    status: 'Ngừng hoạt động',
  },
  {
    id: 'TH003',
    createdAt: '2024-05-20',
    customerCount: 10,
    status: 'Đang hoạt động',
  },
];

const ListThongHanh = () => {
  const [search, setSearch] = useState('');

  const filteredData = mockData.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Danh sách số thông hành</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm số thông hành..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-3">Số thông hành</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Số lượng khách hàng</th>
              <th className="px-4 py-3">Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="text-sm border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.createdAt}</td>
                  <td className="px-4 py-3">{item.customerCount}</td>
                  <td className="px-4 py-3">
                    <Button>Xem chi tiết</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-3 text-center text-gray-500">
                  Không tìm thấy kết quả
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListThongHanh;
