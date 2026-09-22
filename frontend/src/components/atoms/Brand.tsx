import type { FC } from 'react';
import Icon from './Icon';

const Brand: FC = () => (
    <div className="brand">
        <span className="brand-mark"><Icon name="book" size={23} /></span>
        <span>BookKeeping<span className="brand-caption">让生活，心中有数</span></span>
    </div>
);

export default Brand;
