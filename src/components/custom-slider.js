import { Slider, Switch } from '@mui/material'
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react'

import './custom-slider.css'

export default function CustomSlider({ maxDate, minDate }) {
    const until = new Date(maxDate);
    const since = new Date(minDate);

    const startDate = new Date(maxDate);
    const endDate = new Date(minDate);

    const [value, setValue] = useState([]);
    const [checked, setChecked] = useState(false);

    const convertDatesToArray = (until, since) => {
        const arrDates = [];
        if (!checked) {
            let start = new Date(until.setFullYear(until.getFullYear() - 2));
            let end = new Date(since.setFullYear(since.getFullYear() + 2));
            for (let i = Date.parse(start); i < Date.parse(end); i = Date.parse(new Date(start.setMonth(start.getMonth() + 1)))) {
                arrDates.push(new Date(i))
            }
            return arrDates;
        }
        else {
            let start = new Date(until.setMonth(until.getMonth() - 2));
            let end = new Date(since.setMonth(since.getMonth() + 6));
            for (let i = Date.parse(start); i < Date.parse(end); i = Date.parse(new Date(start.setMonth(start.getMonth() + 1)))) {
                arrDates.push(new Date(i))
            }
            return arrDates;
        }
    }

    const dates = convertDatesToArray(startDate, endDate)
    const marks = dates && dates.map((x, i) => ({ value: i, label: x }))

    useEffect(() => {
        const start = marks && marks.find(x => new Date(x.label).toLocaleDateString() === until.toLocaleDateString())

        const end = marks && marks.find(x => new Date(x.label).toLocaleDateString() === since.toLocaleDateString())

        setValue([start.value, end.value])
    }, [checked])

    const itemMark = (i) => {
        if (!checked) {
            return marks[i].label.getFullYear()
        }
        else {
            return <div style={{ fontWeight: 700, color: 'black' }} >{marks[i].label.getFullYear()}</div>
        }
    }

    const convertDate = () => {
        let arrayGaps = [];
        let counter = 12;
        for (let i = 0; i < marks.length; i++) {
            if (i === 0) {
                arrayGaps.push(itemMark(i))
            }
            else if (i === 12 - startDate.getMonth()) {
                arrayGaps.push(itemMark(i))
            }
            else if (i === (12 - startDate.getMonth()) + counter) {
                counter = counter + 12
                arrayGaps.push(itemMark(i))
            }
            else {
                if (!checked) {
                    arrayGaps.push('')
                }
                else {
                    arrayGaps.push(<div style={{ fontSize: 12, marginTop: 2 }} >{new Date(marks[i].label)
                        .toLocaleDateString('ru', { month: 'long' })
                        .slice(0, 3)}</div>)
                }
            }
        }
        return arrayGaps;
    }
    const marksLine = convertDate().map((x, i) => ({ value: i, label: x }))

    const handleChangeSlider = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSwitch = (event) => {
        setChecked(event.target.checked);
    };

    function calculateValue(value) {
        const shortInx = value > marks.length - 1 ? marks.length - 1 : value;
        if (marks[shortInx])
            return <div>{new Date(marks[shortInx].label)
                .toLocaleDateString('ru', { month: 'long' })
                .charAt(0)
                .toUpperCase()
                +
                new Date(marks[shortInx].label)
                    .toLocaleDateString('ru', { month: 'long' })
                    .slice(1)}
                <div>
                    {new Date(marks[shortInx].label)
                        .getFullYear()}</div></div>
    }

    return (
        <div className='custom-slider-container'>
            <div className='slider-body'  >
                <Box sx={{ maxWidth: 1000, display: 'flex', alignItems: 'center' }}>
                    <div className='months-or-years'>
                        <p className={`years ${!checked && 'active-p'}`}>Все года</p>
                        <p className={`months ${checked && 'active-p'}`}>Месяца</p>
                    </div>
                    <Slider
                        className={'slider'}
                        min={0}
                        max={dates.length - 1}
                        value={value}
                        onChange={handleChangeSlider}
                        valueLabelDisplay="on"
                        marks={marksLine}
                        step={1}
                        scale={calculateValue}
                    />
                </Box>
                <Switch checked={checked}
                    onChange={handleChangeSwitch} />
            </div>
        </div>
    )
}
