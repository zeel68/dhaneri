import React from 'react'

export default function
    () {
    return (
        <div className='flex items-center justify-center'>
            <div className="bg-white rounded-2xl max-w-4xl w-full flex flex-col  max-h-[90vh] overflow-y-auto">
                <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Size Guide</h2>
                        <p className="text-slate-300 mt-1">Find your perfect fit</p>
                    </div>

                </div>
                <div className="p-5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="py-2 px-3 font-semibold text-slate-900">Size</th>
                                    <th className="py-2 px-3 font-semibold text-slate-900">Bust (inches)</th>
                                    <th className="py-2 px-3 font-semibold text-slate-900">Waist (inches)</th>
                                    <th className="py-2 px-3 font-semibold text-slate-900">Hip (inches)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { size: 'S', bust: '32-34', waist: '26-28', hip: '36-38' },
                                    { size: 'M', bust: '34-36', waist: '28-30', hip: '38-40' },
                                    { size: 'L', bust: '36-38', waist: '30-32', hip: '40-42' },
                                    { size: 'XL', bust: '38-40', waist: '32-34', hip: '42-44' },
                                    { size: 'XXL', bust: '40-42', waist: '34-36', hip: '44-46' }
                                ].map((row) => (
                                    <tr key={row.size} className="border-b border-slate-200">
                                        <td className="py-2 px-3 font-semibold text-slate-800">{row.size}</td>
                                        <td className="py-2 px-3 text-slate-600">{row.bust}</td>
                                        <td className="py-2 px-3 text-slate-600">{row.waist}</td>
                                        <td className="py-2 px-3 text-slate-600">{row.hip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
