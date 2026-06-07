type PageTapZonesProps = {
  disabled: boolean;
  onPrevious: () => void;
  onToggleControls: () => void;
  onNext: () => void;
};

export const PageTapZones = ({ disabled, onPrevious, onToggleControls, onNext }: PageTapZonesProps) => {
  if (disabled) {
    return null;
  }

  return (
    <div className="tap-zones" aria-hidden="true">
      <button className="tap-zone tap-zone-left" tabIndex={-1} type="button" onClick={onPrevious} />
      <button className="tap-zone tap-zone-center" tabIndex={-1} type="button" onClick={onToggleControls} />
      <button className="tap-zone tap-zone-right" tabIndex={-1} type="button" onClick={onNext} />
    </div>
  );
};
