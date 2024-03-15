import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaLevelDownAlt, FaLevelUpAlt, FaRegChartBar, FaCaretUp, FaCaretDown } from "react-icons/fa";
import axios from 'axios';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function Investo() {
    const [table, setTable] = useState(null);

    const fetchdata = async () => {
        try {
            const response = await axios.get("https://intradayscreener.com/api/openhighlow/cash");
            setTable(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchdata();
    }, []);

    const handleCheckboxChange = (symbol) => {
        console.log(`Checkbox for symbol ${symbol} clicked`);
    };

    // const calculateTodaysRange = (low, high) => {
    //     return high - low;
    // };

    const calculateLTPPercentage = (ltp, open) => {
        return ((ltp - open) / open) * 100;
    };

    const getLTPPercentageColor = (ltpPercentage) => {
        return ltpPercentage >= 0 ? 'green' : 'red';
    };

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>SYMBOL</th>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>LTP <FaInfoCircle /></th>
                        <th style={{ border: '1px solid black', padding: '1rem', fontSize: '1rem' }}>MOMENTUM <FaInfoCircle /></th>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>OPEN <FaInfoCircle /></th>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>Deviation from Pivots <FaInfoCircle /></th>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>TODAYS RANGE <FaInfoCircle /></th>
                        <th style={{ border: '1px solid black', padding: '1rem' }}>OHL <FaInfoCircle /></th>
                    </tr>
                </thead>
                <tbody>
                    {table && table.map((values) => (
                        <tr key={values.symbol} style={{ border: '1px solid black' }}>
                            <td style={{ padding: "10px", border: "1px solid black", fontWeight: 'bolder', position: 'relative' }}>
                                <input type="checkbox" onChange={() => handleCheckboxChange(values.symbol)} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }} />
                                <span style={{ marginLeft: '20px', color: '#007FFF' }}>{values.symbol} </span>
                                <FaRegChartBar style={{ marginLeft: '20px', color: 'lightash' }} size={23} />
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black" }}>
                                <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <span style={{ marginLeft: '5px' }}>{values.ltp}</span>
                                </div>
                                <div style={{ textAlign: 'center', color: getLTPPercentageColor(calculateLTPPercentage(values.ltp, values.open)) }}>
                                    {calculateLTPPercentage(values.ltp, values.open) >= 0 ? <FaCaretUp style={{ color: 'green', marginTop: '10px' }} /> : <FaCaretDown style={{ color: 'red', marginTop: '10px' }} size={16} />}
                                    {calculateLTPPercentage(values.ltp, values.open).toFixed(2)}%
                                </div>
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black", color: 'green' }}>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px', marginRight: '5px' }}>
                                    {values.stockOutperformanceRank}</span>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px', marginRight: '5px' }}>{' ' + values.stockMomentumRank}</span>
                                <span style={{ backgroundColor: '#abf7b1', padding: '2px 5px', borderRadius: '10px' }}>{' ' + values.sectorMomentumRank}</span>
                            </td>
                            <td style={{ padding: "10px", border: "1px solid black" }}>{values.open}</td>
                            <td style={{ padding: "10px", border: "1px solid black" }}>{values.pctChange}</td>
                            <td style={{ padding: "5px", border: "1px solid black" }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    {values.low + ' '}
                                    <Slider min={0} max={550} defaultValue={(values.high - values.low) / 2} style={{marginLeft:'9px',marginRight:'5px'}}/>
                                    {' ' + values.high}
                                </div>
                            </td>
                            <td style={{ padding: "10px", fontWeight: 'normal', fontSize: '13px' }}>
                                <span style={{ backgroundColor: values.openHighLowSignal === 'Open=Low' ? '#abf7b1' : values.openHighLowSignal === 'Open=High' ? '#FF8A8A' : 'inherit', borderRadius: '80px', padding: '5px', color: values.openHighLowSignal === 'Open=Low' ? '#228C22' : values.openHighLowSignal === 'Open=High' ? '#DA012D' : 'inherit' }}>
                                    {values.openHighLowSignal === 'Open=Low' && <FaLevelUpAlt style={{ color: 'green' }} />}
                                    {values.openHighLowSignal === 'Open=High' && <FaLevelDownAlt style={{ color: 'red' }} />}
                                    {values.openHighLowSignal}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Investo;
