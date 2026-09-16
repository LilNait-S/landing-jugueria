import Image from 'next/image';
import { FruitFlight } from './fruit-flight';
import { fruitPieces } from './fruit-pieces';

export function FlavorDecorations({ flavor, previous, serial }: {
  flavor: string;
  previous?: string;
  serial: number;
}) {
  return (
    <div className="blackberry-composition">
      <Image src="/images/blackberry/scribbles.svg" alt="" fill
        sizes="(max-width: 767px) 178vw, 100vw" className="blackberry-scribbles" />
      {previous && (
        <div key={`out-${serial}`} className="fruit-set fruit-set-outgoing" data-fruit-flavor={previous}>
          {fruitPieces(previous).map(piece => <FruitFlight key={piece.id} piece={piece} />)}
        </div>
      )}
      <div key={`in-${serial}`} className={`fruit-set ${previous ? 'fruit-set-incoming' : ''}`} data-fruit-flavor={flavor}>
        {fruitPieces(flavor).map(piece => <FruitFlight key={piece.id} piece={piece} />)}
      </div>
    </div>
  );
}
