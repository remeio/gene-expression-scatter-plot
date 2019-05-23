/*Reference: https://www.easycalculation.com/statistics/p-value-pearson-coefficient.php*/
function TtoP(t, df) 
{
  with (Math) 
  {
     var abst = abs(t), tsq = t*t, p;
     if(df == 1) 
     {
       p = 1 - 2*atan(abst)/PI;
     }
     else if (df == 2) 
     {
       p = 1 - abst/sqrt(tsq + 2);
     }
     else if (df == 3) 
     {
       p = 1 - 2*(atan(abst/sqrt(3)) + abst*sqrt(3)/(tsq + 3))/PI;
     }
     else if (df == 4) 
     {
       p = 1 - abst*(1 + 2/(tsq + 4))/sqrt(tsq + 4);
     }
     else 
     {
       var z = TtoZ(abst, df);
       if (df>4)
        {
          p = Norm_p(z);
        }
	else 
	{
	  p = Norm_p(z); 
	}
      }
    }
  return p;
}

function TtoZ(t, df) 
{
  var A9 = df - 0.5;
  var B9 = 48*A9*A9;
  var T9 = t*t/df, Z8, P7, B7, z;
  with (Math) 
  {
    if (T9 >= 0.04) 
    {
      Z8 = A9*log(1+T9);
    }
    else
    {
      Z8 = A9*(((1 - T9*0.75)*T9/3 - 0.5)*T9 + 1)*T9;
    }
    P7 = ((0.4*Z8 + 3.3)*Z8 + 24)*Z8 + 85.5;
    B7 = 0.8*pow(Z8, 2) + 100 + B9;
    z = (1 + (-P7/B7 + Z8 + 3)/B9)*sqrt(Z8);
    return z;
  }
}

function Norm_p(z) 
{
  var absz = Math.abs(z);
  var a1 = 0.0000053830;
  var a2 = 0.0000488906;
  var a3 = 0.0000380036;
  var a4 = 0.0032776263;
  var a5 = 0.0211410061;
  var a6 = 0.0498673470;
  var p = (((((a1*absz+a2)*absz+a3)*absz+a4)*absz+a5)*absz+a6)*absz+1;
  p = Math.pow(p, -16);
  return p;
}