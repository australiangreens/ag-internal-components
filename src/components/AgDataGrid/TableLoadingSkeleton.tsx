import { Box, Skeleton, SxProps } from '@mui/material';
import type { CSSProperties } from 'react';

const BASE_SKELETON_OPACITY = 0.11;
const ROWS_BEFORE_FADE_OUT = 10;
const SKELETON_ROW_HEIGHT = 40;
const DEFAULT_COLUMN_STYLES = {
  marginLeft: '3px',
  marginRight: '3px',
  borderRadius: 2,
};
const BASE_ROW_STYLE: CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

const DEFAULT_FIRST_ROW_STYLE = {};

export type TableLoadingSkeletonProps = {
  numberOfRows: number;
  firstRowStyle?: CSSProperties | undefined;
  rowHeight?: string | number | undefined;
  columnWidths: number[];
  columnStyles?: SxProps | undefined;
};

const generateSkeletonCellsForRow = (
  rowIdx: number,
  columnWidths: number[],
  rowHeight: string | number,
  columnStyles: SxProps
) => {
  const bgcolor = `rgba(0, 0, 0, ${
    BASE_SKELETON_OPACITY * ((ROWS_BEFORE_FADE_OUT - rowIdx) / ROWS_BEFORE_FADE_OUT)
  })`;
  return (
    <>
      {columnWidths.map((element, colIdx) => (
        <Skeleton
          key={colIdx}
          variant="rectangular"
          height={rowHeight}
          sx={{ bgcolor, flex: element, marginTop: -1, marginBottom: -1, ...columnStyles }}
        />
      ))}
    </>
  );
};

const TableLoadingSkeleton = ({
  numberOfRows,
  firstRowStyle = DEFAULT_FIRST_ROW_STYLE as CSSProperties,
  rowHeight = SKELETON_ROW_HEIGHT,
  columnWidths,
  columnStyles = DEFAULT_COLUMN_STYLES,
}: TableLoadingSkeletonProps) => {
  const dummyArray = Array(Math.min(numberOfRows, ROWS_BEFORE_FADE_OUT)).fill(1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {dummyArray.map((_element, index) => {
        const style: CSSProperties =
          index === 0 ? { ...BASE_ROW_STYLE, ...firstRowStyle } : BASE_ROW_STYLE;

        return (
          <p key={index} style={style}>
            {generateSkeletonCellsForRow(index, columnWidths, rowHeight, columnStyles)}
          </p>
        );
      })}
    </Box>
  );
};

export default TableLoadingSkeleton;
