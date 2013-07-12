exports.mod = function( v, l ) {

  while ( v < 0 ) {
    v += l;
  }
  return v % l;
}

exports.ease = function( cur, dest, ease) {

  var diff = dest - cur;
  if ( diff < ease ) {
    cur = dest;
  } else {
    cur += diff * ease;
  }
  return cur;

}

