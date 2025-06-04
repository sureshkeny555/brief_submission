import React, { useEffect, useState } from 'react';
import './Step.scss';
import FailedIcon from '../../assets/svg/failed.svg';
import CancelIcon from '../../assets/svg/cancel.svg';
import WarningIcon from '../../assets/svg/warning.svg';
import CheckIcon from '../../assets/svg/check.svg';
import { ReactSVG } from 'react-svg';
import { useDispatch, useSelector } from 'react-redux';
import { getBriefStatus } from '../../../store/features/briefsData';

const STATUS_ICONS = {
  'Completed': CheckIcon,
  'In Progress': WarningIcon,
  'Not Done': CancelIcon,
};

const ProgressTracker = () => {
  const [flattenedStatuses, setFlattenedStatuses] = useState([]);

  const dispatch = useDispatch();

  const allBrief = useSelector((state) => state?.briefs?.getAllBrief?.briefs);

  useEffect(() => {
    const output = allBrief.map(brief => {
      const statusBars = brief.status_bar;
      return Object.entries(statusBars).map(([testType, status]) => {
        return { testType, status };
      });
    });
  
    const flattenedStatuses = output.flat();
    setFlattenedStatuses(flattenedStatuses);
  }, [allBrief]);
  

  const statusMap = new Map();
  flattenedStatuses.forEach(({ testType, status }) => {
    if (!statusMap.has(testType)) {
      statusMap.set(testType, new Set());
    }
    statusMap.get(testType).add(status);
  });
  
  const getStepStatus = (stepName) => {
    return Array.from(statusMap.get(stepName) || ['Not Done']);
  };

  useEffect(() => {
    dispatch(getBriefStatus());
  }, [dispatch]);

  const steps = [
    { name: 'Concept', status: getStepStatus('Concept test') },
    { name: 'Product', status: getStepStatus('Product test') },
    { name: 'Pack', status: getStepStatus('Pack test') },
    { name: 'Ad', status: getStepStatus('Advertisement test') },
    { name: 'Brand', status: getStepStatus('Brand track') },
  ];

  // Helper function to render status icons
  const renderStatusIcon = (status) => {
    const icon = STATUS_ICONS[status] || CancelIcon;
    return <ReactSVG src={icon} />;
  };

  return (
    <div className="progress-bar">
      {steps.map((step, index) => (
        <div key={index} className="step-container">
          <div className="circle-line-wrapper">
            <div className={`circle ${step.status?.[0]?.replace(/\s+/g, '-') || ''}`}>
              {renderStatusIcon(step.status?.[0])}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`line ${steps[index + 1]?.status?.[0]?.replace(/\s+/g, '-') || ''}`}
              ></div>
            )}
          </div>
          <div className="step-name">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
