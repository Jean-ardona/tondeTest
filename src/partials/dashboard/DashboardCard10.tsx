interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  spent: string;
}

function DashboardCard10() {
  const customers: Customer[] = [
    { id: '0', name: 'Alex Shatov', email: 'alexshatov@gmail.com', location: '🇺🇸', spent: '$2,890.66' },
    { id: '1', name: 'Philip Harbach', email: 'philip.h@gmail.com', location: '🇩🇪', spent: '$2,767.04' },
    { id: '2', name: 'Mirko Fisuk', email: 'mirkofisuk@gmail.com', location: '🇫🇷', spent: '$2,996.00' },
    { id: '3', name: 'Olga Semklo', email: 'olga.s@cool.design', location: '🇮🇹', spent: '$1,220.66' },
    { id: '4', name: 'Burak Long', email: 'longburak@gmail.com', location: '🇬🇧', spent: '$1,890.66' },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Customers</h2>
      </header>
      <div className="p-3">
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50">
              <tr>
                {['Name', 'Email', 'Spent', 'Country'].map((h, i) => (
                  <th key={h} className="p-2 whitespace-nowrap">
                    <div className={`font-semibold ${i === 3 ? 'text-center' : 'text-left'}`}>{h}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700/60">
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 shrink-0 mr-2 sm:mr-3 rounded-full bg-violet-500 flex items-center justify-center text-white text-sm font-semibold">
                        {c.name[0]}
                      </div>
                      <div className="font-medium text-gray-800 dark:text-gray-100">{c.name}</div>
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap"><div className="text-left">{c.email}</div></td>
                  <td className="p-2 whitespace-nowrap"><div className="text-left font-medium text-green-500">{c.spent}</div></td>
                  <td className="p-2 whitespace-nowrap"><div className="text-lg text-center">{c.location}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard10;
