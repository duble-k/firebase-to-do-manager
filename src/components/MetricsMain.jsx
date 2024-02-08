import React from 'react';
import Grid from '@mui/material/Grid';
import CompareTodos from './metrics/CompareTodos'
import CompletionChart from './metrics/CompletionChart';

const MetricsMain = () => {
    return (
        <Grid container spacing={2}>
            {/* Metrics Component 1 */}
            <Grid item xs={6}>
                <CompareTodos />
            </Grid>

            {/* Metrics Component 2 */}
            <Grid item xs={6}>
                <CompletionChart />
            </Grid>
        </Grid>
    );
};

export default MetricsMain;
