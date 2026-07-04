function DashboardCard13() {
  const inIcon = (
    <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
      <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z" />
    </svg>
  );
  const outIcon = (
    <svg className="w-9 h-9 fill-current text-white" viewBox="0 0 36 36">
      <path d="M17.7 24.7l1.4-1.4-4.3-4.3H25v-2H14.8l4.3-4.3-1.4-1.4L11 18z" />
    </svg>
  );
  const cancelIcon = (
    <svg className="w-9 h-9 fill-current text-gray-400" viewBox="0 0 36 36">
      <path d="M21.477 22.89l-8.368-8.367a6 6 0 008.367 8.367zm1.414-1.413a6 6 0 00-8.367-8.367l8.367 8.367zM18 26a8 8 0 110-16 8 8 0 010 16z" />
    </svg>
  );

  const items = [
    { icon: outIcon, bg: 'bg-red-500', label: 'Qonto', sub: 'billing', amount: '-$49.88', amountClass: 'text-gray-800 dark:text-gray-100' },
    { icon: inIcon, bg: 'bg-green-500', label: 'Cruip.com', sub: 'Market Ltd 70 Wilson St London', amount: '+249.88', amountClass: 'text-green-600' },
    { icon: inIcon, bg: 'bg-green-500', label: 'Notion Labs Inc', sub: '', amount: '+99.99', amountClass: 'text-green-600' },
    { icon: inIcon, bg: 'bg-green-500', label: 'Market Cap Ltd', sub: '', amount: '+1,200.88', amountClass: 'text-green-600' },
    { icon: cancelIcon, bg: 'bg-gray-200', label: 'App.com', sub: 'Market Ltd 70 Wilson St London', amount: '+$99.99', amountClass: 'text-gray-800 dark:text-gray-100 line-through' },
    { icon: outIcon, bg: 'bg-red-500', label: 'App.com', sub: 'Market Ltd 70 Wilson St London', amount: '-$49.88', amountClass: 'text-gray-800 dark:text-gray-100' },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Income/Expenses</h2>
      </header>
      <div className="p-3">
        <div>
          <header className="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2">Today</header>
          <ul className="my-1">
            {items.map((item, i) => (
              <li key={i} className="flex px-2">
                <div className={`w-9 h-9 rounded-full shrink-0 ${item.bg} my-2 mr-3`}>
                  {item.icon}
                </div>
                <div className={`grow flex items-center ${i < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700/60' : ''} text-sm py-2`}>
                  <div className="grow flex justify-between">
                    <div className="self-center">
                      <a className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white" href="#0">{item.label}</a>
                      {item.sub && ` ${item.sub}`}
                    </div>
                    <div className="shrink-0 self-start ml-2">
                      <span className={`font-medium ${item.amountClass}`}>{item.amount}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard13;
