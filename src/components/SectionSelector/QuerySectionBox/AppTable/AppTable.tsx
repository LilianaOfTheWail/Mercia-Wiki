import React from 'react';
import './AppTable.css';
import { MetadataSummaryProps } from '../../../../common/types';
import AppLink from '../../../AppLink/AppLink';

interface AppTableProps {
  items: MetadataSummaryProps[];
  fields: string[];
}

function AppTable({ items, fields }: AppTableProps) {
  return (
    <div className="app-table__wrap">
      <table className="app-table">
        <thead>
          <tr>
            <th className="app-table__heading app-table__heading--name">
              Name
            </th>
            {fields.map((field) => (
              <th key={field} className="app-table__heading">
                {field}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name}>
              <td className="app-table__cell app-table__cell--name">
                <AppLink href={item.href || '#'} className="app-table__link">
                  {item.name}
                </AppLink>
              </td>
              {fields.map((field) => (
                <td key={field} className="app-table__cell">
                  {item.metadata?.[field] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppTable;
