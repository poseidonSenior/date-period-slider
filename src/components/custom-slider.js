import { Slider, Switch } from '@mui/material'
import { Box } from '@mui/system';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import './custom-slider.css'
import { FINISH_DATE, MaxDateYear, MinDateYear, START_DATE, MaxDateMonth, MinDateMonth } from './helpers/custom-slider.const';

export const CustomSlider = () => {
    const [value, setValue] = useState([]);
    const [checked, setChecked] = useState(false);
    const [size, setSize] = useState();
    const refSlider = useRef();

    const convertDatesToArray = useCallback((startDate, endDate) => {
        const arrDates = [];
        if (!checked) {
            let start = new Date(startDate.setFullYear(startDate.getFullYear()));
            let end = new Date(endDate.setFullYear(endDate.getFullYear()));
            for (let i = Date.parse(start); i < Date.parse(end); i = Date.parse(new Date(start.setMonth(start.getMonth() + 1)))) {
                arrDates.push(new Date(i))
            }
            return arrDates;
        }
        else {
            let start = new Date(startDate.setMonth(startDate.getMonth()));
            let end = new Date(endDate.setMonth(endDate.getMonth()));
            for (let i = Date.parse(start); i < Date.parse(end); i = Date.parse(new Date(start.setMonth(start.getMonth() + 1)))) {
                arrDates.push(new Date(i))
            }
            return arrDates;
        }
    }, [])

    const dates = useMemo(() => {
        return checked ? convertDatesToArray(MinDateMonth, MaxDateMonth) : convertDatesToArray(MinDateYear, MaxDateYear)
    }, [checked])

    const marks = useMemo(() => { return dates.map((x, i) => ({ value: i, label: x })) }, [checked])

    useEffect(() => {
        const start = marks && marks.find(x => new Date(x.label).toLocaleDateString() === START_DATE.toLocaleDateString())

        const end = marks && marks.find(x => new Date(x.label).toLocaleDateString() === FINISH_DATE.toLocaleDateString())

        setValue([start.value, end.value])
    }, [checked, dates])

    const itemMark = useCallback((i) => {
        if (!checked) {
            return <div className={classNames('text-year', {
                'first-size': marks.length > 80 || size < 250,
                'second-size': size < 150
            })}>{marks[i].label.getFullYear()}</div>
        }
        else {
            return <div className="highlight-text-year" >{marks[i].label.getFullYear()}</div>
        }
    }, [marks, size])

    const convertDate = useCallback(() => {
        let arrayGaps = [];
        let counter = 12;
        for (let i = 0; i < marks.length; i++) {
            if (!checked) {
                if (i === 0) {
                    arrayGaps.push(itemMark(i))
                }
                else if (i === 12 - START_DATE.getMonth()) {
                    arrayGaps.push(itemMark(i))
                }
                else if (i === (12 - START_DATE.getMonth()) + counter) {
                    counter = counter + 12
                    arrayGaps.push(itemMark(i))
                }
                else {
                    arrayGaps.push('')
                }
            } else {
                if (i === 0) {
                    arrayGaps.push(itemMark(i))
                }
                else if (i === 14 - START_DATE.getMonth()) {
                    arrayGaps.push(itemMark(i))
                }
                else if (i === (14 - START_DATE.getMonth()) + counter) {
                    counter = counter + 12
                    arrayGaps.push(itemMark(i))
                }
                else {
                    arrayGaps.push(<div className={classNames('marks-months-between-years', {
                        'first-size': (marks.length > 30 || size < 740),
                        'second-size': marks.length > 38 || size < 380 || (marks.length > 27 && size < 580)
                    })} >{new Date(marks[i].label)
                        .toLocaleDateString('ru', { month: 'long' })
                        .slice(0, 3)}</div>)
                }
            }
        }

        return arrayGaps;
    }, [marks, size])

    const marksLine = convertDate().map((x, i) => ({ value: i, label: x }))

    const handleChangeSlider = useCallback((event, newValue) => {
        setValue(newValue);
    }, [value])

    const handleChangeSwitch = useCallback((event) => {
        setChecked(event.target.checked);
    }, [checked])

    const calculateValue = useCallback((value) => {
        const shortInx = value > marks.length - 1 ? marks.length - 1 : value;
        if (marks[shortInx])
            return <div className='tooltip-month'>{new Date(marks[shortInx].label)
                .toLocaleDateString('ru', { month: 'long' })
                .charAt(0)
                .toUpperCase()
                +
                new Date(marks[shortInx].label)
                    .toLocaleDateString('ru', { month: 'long' })
                    .slice(1)}
                <div className='tooltip-year'>
                    {new Date(marks[shortInx].label)
                        .getFullYear()}</div></div>
    }, [marks])

    const resizeHandler = useCallback(() => {
        setSize(refSlider.current.clientWidth);
    }, [size])

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    const content = useMemo(() => {
        return (<Box sx={{ maxWidth: 1000, display: 'flex', alignItems: 'center' }}>
            <div className='months-or-years'>
                <p className={`years ${!checked && 'active-p'}`}>Все года</p>
                <p className={`months ${checked && 'active-p'}`}>Месяца</p>
            </div>
            <Slider
                ref={refSlider}
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
        </Box>)
    }, [checked, value, size])

    return (
        <div className='custom-slider-container'>
            <div className='slider-body'  >
                {content}
                <Switch checked={checked}
                    onChange={handleChangeSwitch} />
            </div>
        </div>
    )
}